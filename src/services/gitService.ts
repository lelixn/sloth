import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import {
  simpleGit,
  SimpleGit,
  StatusResult,
  CommitResult,
  PushResult,
  PullResult,
  DefaultLogFields
} from 'simple-git';

/**
 * Custom error class for all Git service operations within Sloth.
 */
export class GitServiceError extends Error {
  constructor(message: string, public override readonly cause?: unknown) {
    super(message);
    this.name = 'GitServiceError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

let cachedGitService: GitService | null = null;
let cachedPath: string | null = null;

/**
 * Returns a cached instance of GitService for the target workspace directory.
 * Reuses the existing instance if the workspace path has not changed.
 *
 * @param customPath Optional workspace path override.
 * @returns Cached GitService instance.
 */
export function getGitService(customPath?: string): GitService {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const targetPath = customPath || (workspaceFolders && workspaceFolders.length > 0 ? workspaceFolders[0].uri.fsPath : undefined);

  if (!targetPath) {
    throw new GitServiceError('No workspace folder is currently open in VS Code.');
  }

  if (cachedGitService && cachedPath === targetPath) {
    return cachedGitService;
  }

  cachedGitService = new GitService(targetPath);
  cachedPath = targetPath;
  return cachedGitService;
}

/**
 * Clears the cached GitService instance (e.g. when workspace folders change).
 */
export function clearGitServiceCache(): void {
  cachedGitService = null;
  cachedPath = null;
}

/**
 * Service encapsulating Git workflow operations using simple-git.
 */
export class GitService {
  private readonly git: SimpleGit;
  private readonly workspacePath: string;

  /**
   * Initializes a new instance of GitService.
   * Automatically detects the active VS Code workspace folder if customPath is not specified.
   *
   * @param customPath Optional directory path override for the Git repository.
   * @throws GitServiceError if no workspace is open or if the target directory is not a Git repository.
   */
  constructor(customPath?: string) {
    let targetPath = customPath;

    if (!targetPath) {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        throw new GitServiceError('No workspace folder is currently open in VS Code.');
      }
      targetPath = workspaceFolders[0].uri.fsPath;
    }

    this.workspacePath = targetPath;

    const gitDir = path.join(this.workspacePath, '.git');
    if (!fs.existsSync(gitDir)) {
      throw new GitServiceError(`The directory "${this.workspacePath}" is not a Git repository.`);
    }

    this.git = simpleGit(this.workspacePath);
  }

  /**
   * Checks whether the current working workspace directory is a valid Git repository.
   *
   * @returns Promise resolving to true if the directory is a valid Git repository.
   * @throws GitServiceError if checking repository status fails.
   */
  public async isGitRepository(): Promise<boolean> {
    try {
      const isRepo = await this.git.checkIsRepo();
      return isRepo;
    } catch (error) {
      throw new GitServiceError('Failed to check if directory is a Git repository.', error);
    }
  }

  /**
   * Retrieves the current working tree status of the repository.
   *
   * @returns Promise resolving to the StatusResult object containing modified, staged, and untracked files.
   * @throws GitServiceError if retrieving the repository status fails.
   */
  public async status(): Promise<StatusResult> {
    try {
      const statusResult = await this.git.status();
      if (!statusResult) {
        throw new GitServiceError('Git status operation returned an empty response.');
      }
      return statusResult;
    } catch (error) {
      if (error instanceof GitServiceError) {
        throw error;
      }
      throw new GitServiceError('Failed to retrieve Git repository status.', error);
    }
  }

  /**
   * Retrieves the name of the currently checked out Git branch.
   *
   * @returns Promise resolving to the current branch name string.
   * @throws GitServiceError if unable to determine current branch or if detached HEAD.
   */
  public async currentBranch(): Promise<string> {
    try {
      const statusResult = await this.git.status();
      const branch = statusResult.current;
      if (!branch) {
        throw new GitServiceError('Could not determine current Git branch (detached HEAD or uninitialized repo).');
      }
      return branch;
    } catch (error) {
      if (error instanceof GitServiceError) {
        throw error;
      }
      throw new GitServiceError('Failed to retrieve current Git branch.', error);
    }
  }

  /**
   * Retrieves details of the most recent commit in the repository log.
   *
   * @returns Promise resolving to the DefaultLogFields of the latest commit.
   * @throws GitServiceError if no commits exist or log retrieval fails.
   */
  public async lastCommit(): Promise<DefaultLogFields> {
    try {
      const logResult = await this.git.log({ maxCount: 1 });
      const latest = logResult.latest;
      if (!latest) {
        throw new GitServiceError('No commits found in the current repository history.');
      }
      return latest;
    } catch (error) {
      if (error instanceof GitServiceError) {
        throw error;
      }
      throw new GitServiceError('Failed to retrieve last commit info.', error);
    }
  }

  /**
   * Stages all changes in the current workspace directory (`git add .`).
   *
   * @returns Promise resolving when files are staged.
   * @throws GitServiceError if staging changes fails.
   */
  public async addAll(): Promise<void> {
    try {
      await this.git.add('.');
    } catch (error) {
      throw new GitServiceError('Failed to stage changes with git add.', error);
    }
  }

  /**
   * Creates a commit with the specified message.
   *
   * @param message The commit message text.
   * @returns Promise resolving to the CommitResult object.
   * @throws GitServiceError if message is empty or commit operation fails.
   */
  public async commit(message: string): Promise<CommitResult> {
    if (!message || message.trim().length === 0) {
      throw new GitServiceError('Commit message cannot be empty.');
    }

    try {
      const result = await this.git.commit(message);
      if (!result) {
        throw new GitServiceError('Commit operation returned an invalid result.');
      }
      return result;
    } catch (error) {
      if (error instanceof GitServiceError) {
        throw error;
      }
      throw new GitServiceError('Failed to execute git commit.', error);
    }
  }

  /**
   * Pushes local branch commits to the remote repository.
   *
   * @returns Promise resolving to the PushResult object.
   * @throws GitServiceError if push operation fails.
   */
  public async push(): Promise<PushResult> {
    try {
      const result = await this.git.push();
      if (!result) {
        throw new GitServiceError('Push operation returned an invalid result.');
      }
      return result;
    } catch (error) {
      if (error instanceof GitServiceError) {
        throw error;
      }
      throw new GitServiceError('Failed to execute git push.', error);
    }
  }

  /**
   * Pulls remote branch changes into the current working directory.
   *
   * @returns Promise resolving to the PullResult object.
   * @throws GitServiceError if pull operation fails.
   */
  public async pull(): Promise<PullResult> {
    try {
      const result = await this.git.pull();
      if (!result) {
        throw new GitServiceError('Pull operation returned an invalid result.');
      }
      return result;
    } catch (error) {
      if (error instanceof GitServiceError) {
        throw error;
      }
      throw new GitServiceError('Failed to execute git pull.', error);
    }
  }
}

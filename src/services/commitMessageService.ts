import * as path from 'path';
import * as vscode from 'vscode';
import { GitService, getGitService } from './gitService';

const LAST_COMMIT_MESSAGE_KEY = 'sloth.lastGeneratedCommitMessage';

interface CommitPrediction {
  type: string;
  scope?: string;
  message: string;
}

interface ScoringDetail {
  category: string;
  score: number;
}

/**
 * Service responsible for generating Conventional Commit messages
 * from the current Git repository changes.
 */
export class CommitMessageService {
  private readonly gitService: GitService;
  private readonly workspaceState?: vscode.Memento;

  /**
   * Initializes a new instance of CommitMessageService.
   *
   * @param gitService Optional GitService instance for testability and reuse.
   * @param workspaceState Optional VS Code workspaceState storage for caching.
   */
  constructor(gitService?: GitService, workspaceState?: vscode.Memento) {
    this.gitService = gitService ?? getGitService();
    this.workspaceState = workspaceState;
  }

  /**
   * Generates a Conventional Commit message using analyzed file changes.
   *
   * @returns Promise resolving to the generated commit message.
   */
  public async generateCommitMessage(): Promise<string> {
    const changedFiles = await this.getChangedFileNames();
    if (changedFiles.length === 0) {
      const fallback = 'chore: update project files';
      await this.cacheCommitMessage(fallback);
      return fallback;
    }

    const tokens = this.extractTokensFromPaths(changedFiles);
    const prediction = this.predictCommitTypeAndScope(tokens, changedFiles);
    await this.cacheCommitMessage(prediction.message);

    return prediction.message;
  }

  /**
   * Retrieves the last generated commit message from workspace state.
   *
   * @returns The cached commit message or undefined if not available.
   */
  public getCachedCommitMessage(): string | undefined {
    return this.workspaceState?.get<string>(LAST_COMMIT_MESSAGE_KEY);
  }

  /**
   * Caches the last generated commit message in workspace state.
   *
   * @param message Commit message to store.
   */
  private async cacheCommitMessage(message: string): Promise<void> {
    if (!this.workspaceState) {
      return;
    }
    await this.workspaceState.update(LAST_COMMIT_MESSAGE_KEY, message);
  }

  /**
   * Returns the changed file names currently reported by Git.
   *
   * @returns Promise resolving to an array of changed file paths.
   */
  public async getChangedFileNames(): Promise<string[]> {
    const status = await this.gitService.status();
    const filePaths = status.files.map((file) => file.path);
    return Array.from(new Set(filePaths));
  }

  /**
   * Returns a human-readable explanation of the scoring algorithm used to
   * determine commit type and scope.
   *
   * @returns Explanation string describing the scoring logic.
   */
  public getScoringAlgorithmExplanation(): string {
    return [
      '1. Collect all changed file paths from Git and normalize them to lower case.',
      '2. Tokenize folder names, file names, and extensions from the changed paths.',
      '3. Match tokens against ordered commit-type rules so higher-priority changes',
      '   such as documentation and build-related files are selected first.',
      '4. For scope selection, count matching keywords across all tokens and choose',
      '   the dominant scope. If multiple scopes appear, the one with the highest keyword',
      '   frequency wins.',
      '5. Generate a Conventional Commit message using the inferred type, optional',
      '   scope, and a short descriptive action phrase.',
      '6. If no meaningful type is detected, fall back to `chore: update project files`.'
    ].join(' ');
  }

  /**
   * Infers the commit type, scope, and message from changed file tokens.
   *
   * @param tokens Normalized path tokens from changed files.
   * @param changedFiles Original changed file paths.
   * @returns Inferred commit prediction.
   */
  private predictCommitTypeAndScope(tokens: string[], changedFiles: string[]): CommitPrediction {
    const normalizedTokens = new Set(tokens);
    const pathText = changedFiles.map((file) => file.toLowerCase()).join(' ');

    const commitType = this.inferCommitType(normalizedTokens, pathText);
    const commitScope = this.inferScope(normalizedTokens, pathText, commitType);
    const message = this.buildCommitMessage(commitType, commitScope, pathText);

    return { type: commitType.type, scope: commitScope, message };
  }

  /**
   * Infers the commit type based on ordered keyword rules.
   *
   * @param tokens Set of normalized path tokens.
   * @param pathText Joined normalized file paths.
   * @returns Commit type information.
   */
  private inferCommitType(tokens: Set<string>, pathText: string): { type: string; explicitScope?: string } {
    const rules: Array<{ type: string; explicitScope?: string; patterns: string[] }> = [
      { type: 'docs', patterns: ['readme'] },
      { type: 'build', patterns: ['package.json', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'] },
      { type: 'chore', explicitScope: 'devops', patterns: ['dockerfile', 'docker-compose.yml', 'nginx.conf'] },
      { type: 'test', patterns: ['test', 'tests', '.spec', '.test'] },
      { type: 'style', explicitScope: 'ui', patterns: ['css', 'scss', 'tailwind', 'style'] },
      { type: 'feat', explicitScope: 'auth', patterns: ['auth', 'login', 'jwt', 'oauth'] },
      { type: 'feat', explicitScope: 'api', patterns: ['api', 'server', 'backend', 'controller', 'service'] },
      { type: 'feat', explicitScope: 'routes', patterns: ['route', 'router'] },
      { type: 'feat', explicitScope: 'db', patterns: ['database', 'db', 'migration', 'schema'] },
      { type: 'fix', patterns: ['bug', 'fix', 'issue', 'error'] },
      { type: 'refactor', patterns: ['refactor', 'cleanup'] }
    ];

    for (const rule of rules) {
      if (this.matchesAnyPattern(tokens, pathText, rule.patterns)) {
        return { type: rule.type, explicitScope: rule.explicitScope };
      }
    }

    return { type: 'chore' };
  }

  /**
   * Infers the dominant scope from keyword frequencies.
   *
   * @param tokens Set of normalized path tokens.
   * @param pathText Joined normalized file paths.
   * @param commitType Selected commit type information.
   * @returns The dominant scope string or undefined.
   */
  private inferScope(
    tokens: Set<string>,
    pathText: string,
    commitType: { type: string; explicitScope?: string }
  ): string | undefined {
    if (commitType.explicitScope) {
      return commitType.explicitScope;
    }

    const scopeKeywords: Record<string, string[]> = {
      frontend: ['frontend', 'ui', 'styles', 'tailwind', 'css', 'scss'],
      backend: ['backend', 'server', 'service', 'controller'],
      auth: ['auth', 'login', 'jwt', 'oauth'],
      api: ['api', 'endpoint', 'rest'],
      ui: ['ui', 'view', 'widget', 'layout'],
      db: ['database', 'db', 'migration', 'schema'],
      config: ['config', 'configuration', 'settings', 'env'],
      docker: ['docker', 'nginx', 'compose'],
      docs: ['readme', 'docs', 'documentation']
    };

    const scores: ScoringDetail[] = [];
    for (const [scope, keywords] of Object.entries(scopeKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        if (tokens.has(keyword)) {
          score += 2;
        }
        if (pathText.includes(keyword)) {
          score += 1;
        }
      }
      if (score > 0) {
        scores.push({ category: scope, score });
      }
    }

    if (scores.length === 0) {
      return undefined;
    }

    scores.sort((left, right) => right.score - left.score);
    return scores[0].category;
  }

  /**
   * Builds a Conventional Commit message from type, scope, and context.
   *
   * @param commitType Selected commit type.
   * @param scope Optional scope.
   * @param pathText Joined normalized file paths.
   * @returns Generated Conventional Commit message.
   */
  private buildCommitMessage(
    commitType: { type: string; explicitScope?: string },
    scope: string | undefined,
    pathText: string
  ): string {
    const type = commitType.type;
    const resolvedScope = commitType.explicitScope ?? scope;
    const scopeSuffix = resolvedScope ? `(${resolvedScope})` : '';

    const descriptions: Record<string, string> = {
      docs: 'update documentation files',
      build: 'update build dependencies',
      chore: resolvedScope === 'devops' ? 'update Docker configuration' : 'update project files',
      test: 'improve tests and coverage',
      style: 'refine UI styling',
      feat: this.inferFeatureDescription(pathText, resolvedScope),
      fix: 'resolve issues in changed files',
      refactor: 'simplify and restructure code'
    };

    const description = descriptions[type] ?? 'update project files';
    return `${type}${scopeSuffix}: ${description}`;
  }

  /**
   * Chooses a feature description based on the inferred scope and changed file context.
   *
   * @param pathText Joined normalized file paths.
   * @param resolvedScope Resolved commit scope.
   * @returns Feature description string.
   */
  private inferFeatureDescription(pathText: string, resolvedScope?: string): string {
    if (resolvedScope === 'auth') {
      return 'implement authentication changes';
    }
    if (resolvedScope === 'api') {
      return 'add or update backend API endpoints';
    }
    if (resolvedScope === 'routes') {
      return 'update route handling';
    }
    if (resolvedScope === 'db') {
      return 'update database schema and migrations';
    }
    if (pathText.includes('login') || pathText.includes('auth')) {
      return 'add authentication support';
    }
    if (pathText.includes('api') || pathText.includes('controller') || pathText.includes('service')) {
      return 'add API functionality';
    }
    return 'add feature updates';
  }

  /**
   * Returns true when any pattern appears in path tokens or full path text.
   *
   * @param tokens Set of normalized path tokens.
   * @param pathText Joined normalized file paths.
   * @param patterns Patterns to test.
   */
  private matchesAnyPattern(tokens: Set<string>, pathText: string, patterns: string[]): boolean {
    return patterns.some((pattern) => {
      const normalizedPattern = pattern.toLowerCase();
      if (tokens.has(normalizedPattern)) {
        return true;
      }
      return pathText.includes(normalizedPattern);
    });
  }

  /**
   * Extracts normalized tokens from changed file paths for scoring.
   *
   * @param filePaths Changed file paths from Git.
   * @returns Array of normalized path tokens.
   */
  private extractTokensFromPaths(filePaths: string[]): string[] {
    const tokens: string[] = [];

    for (const filePath of filePaths) {
      const normalizedPath = filePath.toLowerCase();
      const segments = normalizedPath.split(/[\\/]/g);
      for (const segment of segments) {
        if (!segment) {
          continue;
        }

        const ext = path.extname(segment).toLowerCase();
        const name = path.basename(segment, ext);

        tokens.push(segment);
        if (name) {
          tokens.push(name);
        }
        if (ext) {
          tokens.push(ext.replace('.', ''));
        }

        tokens.push(...segment.split(/[^a-z0-9]+/g).filter(Boolean));
      }
    }

    return Array.from(new Set(tokens));
  }
}

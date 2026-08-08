import * as vscode from 'vscode';
import { GitService, GitServiceError, getGitService } from '../services/gitService';
import { CommitMessageService } from '../services/commitMessageService';
import { SlothTerminal } from '../utils/slothTerminal';
import { runWithAnimation } from '../utils/slothAnimation';

/**
 * Extracts a short 7-character commit hash string from Git commit result or repository log.
 *
 * @param gitService GitService instance.
 * @param commitResult Optional CommitResult object from simple-git.
 * @returns Promise resolving to short commit hash string or empty string if unavailable.
 */
async function extractShortCommitHash(
  gitService: GitService,
  commitResult?: { commit: string }
): Promise<string> {
  if (commitResult && commitResult.commit) {
    const match = commitResult.commit.match(/([a-f0-9]{7,40})/i);
    if (match) {
      return match[1].substring(0, 7);
    }
  }

  try {
    const lastCommit = await gitService.lastCommit();
    if (lastCommit && lastCommit.hash) {
      return lastCommit.hash.substring(0, 7);
    }
  } catch {
    // Unable to retrieve last commit info
  }

  return '';
}

/**
 * Formats a friendly error description for known Git failure modes.
 *
 * @param rawError Raw error object or message string.
 * @returns User-friendly error message string.
 */
function getFriendlyErrorReason(rawError: unknown): string {
  const message = rawError instanceof Error ? rawError.message : String(rawError);

  if (message.includes('not a Git repository')) {
    return 'No Git repository found in the current workspace.';
  }
  if (message.includes('nothing to commit') || message.includes('clean')) {
    return 'Nothing to commit. Working tree is clean.';
  }
  if (message.includes('conflict') || message.includes('CONFLICT')) {
    return 'Git merge or rebase conflicts detected. Please resolve conflicts before committing.';
  }
  if (message.includes('index.lock') || message.includes('LOCK')) {
    return 'Git index is locked by another process (.git/index.lock).';
  }
  if (message.includes('empty')) {
    return 'Commit message cannot be empty.';
  }
  return message || 'Nothing was staged / Git rejected the commit.';
}

/**
 * Registers the 'sloth.commit' command with VS Code extension context.
 * Orchestrates the local commit workflow including workspace/repo checks,
 * commit message generation, validation, confirmation Quick Pick, staging,
 * committing, progress notifications, and terminal experience updates.
 *
 * @param context VS Code ExtensionContext instance.
 * @param gitServiceProvider Optional provider function for GitService (allows mocking in tests).
 */
export function registerCommitCommand(
  context: vscode.ExtensionContext,
  gitServiceProvider: (path?: string) => GitService = getGitService
): void {
  const disposable = vscode.commands.registerCommand('sloth.commit', async () => {
    // STEP 1: Check workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      void vscode.window.showWarningMessage('Open a folder before using Sloth.');
      return;
    }

    let gitService: GitService;
    try {
      gitService = gitServiceProvider();

      // STEP 2: Check Git repository
      const isRepo = await gitService.isGitRepository();
      if (!isRepo) {
        void vscode.window.showWarningMessage('No Git repository found in the current workspace.');
        return;
      }
    } catch (error) {
      if (error instanceof GitServiceError) {
        void vscode.window.showWarningMessage('No Git repository found in the current workspace.');
        return;
      }
      console.error('[Sloth]', error);
      const msg = error instanceof Error ? error.message : 'Unknown error';
      void vscode.window.showErrorMessage(`Sloth Commit Error: ${msg}`);
      return;
    }

    // STEP 3: Get Git status
    let status;
    try {
      status = await gitService.status();
    } catch (error) {
      console.error('[Sloth]', error);
      void vscode.window.showErrorMessage('Failed to retrieve Git repository status.');
      return;
    }

    const changedCount = status.files.length;
    if (changedCount === 0 || status.isClean()) {
      void vscode.window.showInformationMessage('Nothing to commit. Working tree is clean.');
      return;
    }

    // Initialize hacker terminal output UI
    const terminal = new SlothTerminal();
    terminal.show();

    // STEP 1 Log: scanning repository
    terminal.addStep('01', 'scanning repository...');
    terminal.startStep('01');
    terminal.completeStep('01', 'repository detected');

    // STEP 2 Log: analyzing changes
    terminal.addStep('02', 'analyzing changes...');
    terminal.startStep('02');
    const fileLabel = changedCount === 1 ? '1 file changed' : `${changedCount} files changed`;
    terminal.completeStep('02', fileLabel);

    // STEP 4: Generate suggested commit message using CommitMessageService
    terminal.addStep('03', 'generating commit message...');
    terminal.startStep('03');

    let suggestedMessage = 'chore: update project files';
    try {
      const commitMessageService = new CommitMessageService(gitService, context.workspaceState);
      suggestedMessage = await commitMessageService.generateCommitMessage();
    } catch (error) {
      console.error('[Sloth]', error);
    }
    terminal.completeStep('03', suggestedMessage);

    // STEP 5: Show InputBox for user editing
    const userMessage = await vscode.window.showInputBox({
      prompt: 'Commit message',
      value: suggestedMessage,
      placeHolder: 'Enter commit message',
      ignoreFocusOut: true
    });

    // STEP 6: User cancellation check
    if (userMessage === undefined) {
      return;
    }

    // STEP 7: Validate message
    const trimmedMessage = userMessage.trim();
    if (!trimmedMessage) {
      void vscode.window.showWarningMessage('Commit message cannot be empty.');
      return;
    }

    // STEP 8: Confirmation Quick Pick
    const confirmation = await vscode.window.showQuickPick(
      [
        { label: 'Commit', description: 'Stage all changes and commit locally' },
        { label: 'Cancel', description: 'Abort commit operation' }
      ],
      {
        placeHolder: 'Commit all changes?',
        ignoreFocusOut: true
      }
    );

    if (!confirmation || confirmation.label === 'Cancel') {
      return;
    }

    // STEP 9 & 10: Stage and Commit with Progress UI & Terminal Animation
    terminal.addStep('04', 'staging changes...');
    terminal.startStep('04');

    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: '🦥 Sloth is preparing your commit...',
          cancellable: false
        },
        async () => {
          await runWithAnimation(
            (frame) => terminal.updateStepAnimation('04', frame),
            async () => {
              await gitService.addAll();
            }
          );
        }
      );
      terminal.completeStep('04', 'git add complete');

      terminal.addStep('05', 'creating commit...');
      terminal.startStep('05');

      let commitResult;
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: '🦥 Sloth is committing changes...',
          cancellable: false
        },
        async () => {
          commitResult = await runWithAnimation(
            (frame) => terminal.updateStepAnimation('05', frame),
            async () => {
              return await gitService.commit(trimmedMessage);
            }
          );
        }
      );
      terminal.completeStep('05', 'commit created');

      const shortHash = await extractShortCommitHash(gitService, commitResult);

      // STEP 11: Success notification & terminal summary
      terminal.showSuccessSummary(shortHash || 'N/A', trimmedMessage);

      const successNotice = shortHash
        ? `🦥 Committed successfully: ${shortHash}`
        : '🦥 Committed successfully';
      void vscode.window.showInformationMessage(successNotice);

      // STEP 12: Refresh Sloth Git Status output automatically
      await vscode.commands.executeCommand('sloth.gitStatus', { append: true });
    } catch (error) {
      console.error('[Sloth]', error);
      const friendlyReason = getFriendlyErrorReason(error);
      terminal.showErrorSummary(friendlyReason);
      void vscode.window.showErrorMessage(`Sloth Commit Failed: ${friendlyReason}`);
    }
  });

  context.subscriptions.push(disposable);
}

import * as path from 'path';
import * as vscode from 'vscode';
import { GitService, GitServiceError, getGitService } from '../services/gitService';
import { getSlothOutputChannel } from '../utils/outputChannel';

/**
 * Formats repository Git status into a styled Output Channel report string.
 */
function formatStatusReport(
  repoName: string,
  branch: string,
  commitHash: string,
  commitMsg: string,
  staged: number,
  modified: number,
  untracked: number,
  isClean: boolean
): string {
  const line = '══════════════════════════════════';
  const treeStatus = isClean ? '✅ Working tree clean' : '⚠ Changes detected';

  return [
    line, '🦥 Sloth Git Status', line, '',
    'Repository', repoName, '',
    'Branch', branch, '',
    'Last Commit', commitMsg, '',
    'Commit', commitHash, '',
    'Changes', '',
    `✅ Staged      : ${staged}`,
    `📝 Modified    : ${modified}`,
    `📄 Untracked   : ${untracked}`, '',
    'Working Tree', '', treeStatus, '', line
  ].join('\n');
}

/**
 * Registers the 'sloth.gitStatus' command with VS Code extension context.
 */
export function registerStatusCommand(
  context: vscode.ExtensionContext,
  gitServiceProvider: (path?: string) => GitService = getGitService,
  channelProvider: () => vscode.OutputChannel = getSlothOutputChannel
): void {
  const disposable = vscode.commands.registerCommand('sloth.gitStatus', async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      void vscode.window.showWarningMessage('Open a folder before using Sloth.');
      return;
    }

    try {
      const gitService = gitServiceProvider();
      const status = await gitService.status();
      const branch = await gitService.currentBranch();
      const repoName = path.basename(workspaceFolders[0].uri.fsPath);

      let commitHash = 'N/A';
      let commitMsg = 'No commits yet';
      try {
        const lastCommit = await gitService.lastCommit();
        commitHash = lastCommit.hash.substring(0, 7);
        commitMsg = lastCommit.message;
      } catch {
        // Initial state before first commit
      }

      const report = formatStatusReport(
        repoName, branch, commitHash, commitMsg,
        status.staged.length, status.modified.length, status.not_added.length, status.isClean()
      );

      const outputChannel = channelProvider();
      outputChannel.clear();
      outputChannel.appendLine(report);
      outputChannel.show(true);
    } catch (error) {
      if (error instanceof GitServiceError && error.message.includes('not a Git repository')) {
        void vscode.window.showWarningMessage('No Git repository found in the current workspace.');
        return;
      }
      const msg = error instanceof Error ? error.message : 'Unknown error';
      void vscode.window.showErrorMessage(`Sloth Status Error: ${msg}`);
    }
  });

  context.subscriptions.push(disposable);
}

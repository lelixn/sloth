import * as path from 'path';
import * as vscode from 'vscode';
import { GitService, GitServiceError, getGitService } from '../services/gitService';

/**
 * Formats repository Git status into a human-readable Markdown string.
 */
function formatStatusMarkdown(
  repoName: string,
  branch: string,
  commitHash: string,
  commitMsg: string,
  staged: number,
  modified: number,
  untracked: number,
  isClean: boolean
): vscode.MarkdownString {
  const md = new vscode.MarkdownString();
  md.appendMarkdown(`### 🦥 Sloth Git Status\n\n`);
  md.appendMarkdown(`**Repository:** ${repoName}\n\n`);
  md.appendMarkdown(`**Branch:** ${branch}\n\n`);
  md.appendMarkdown(`**Last Commit:** ${commitMsg}\n\n`);
  md.appendMarkdown(`**Commit:** ${commitHash}\n\n`);
  md.appendMarkdown(`**Changes:**\n\n`);
  md.appendMarkdown(`- ✅ ${staged} staged\n`);
  md.appendMarkdown(`- 📝 ${modified} modified\n`);
  md.appendMarkdown(`- 📄 ${untracked} untracked\n\n`);
  md.appendMarkdown(`**Working Tree:** ${isClean ? '✅ Working tree clean' : '⚠️ Changes detected'}`);
  return md;
}

/**
 * Registers the 'sloth.gitStatus' command with VS Code extension context.
 * Supports dependency injection via gitServiceProvider parameter.
 *
 * @param context The extension context for pushing disposables.
 * @param gitServiceProvider Function providing GitService instance (defaults to getGitService).
 */
export function registerStatusCommand(
  context: vscode.ExtensionContext,
  gitServiceProvider: (path?: string) => GitService = getGitService
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
        // Handle uncommitted initial repository state
      }

      const isClean = status.isClean();
      const markdown = formatStatusMarkdown(
        repoName,
        branch,
        commitHash,
        commitMsg,
        status.staged.length,
        status.modified.length,
        status.not_added.length,
        isClean
      );

      void vscode.window.showInformationMessage(markdown.value);
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

import * as vscode from 'vscode';
import { CommitMessageService } from '../services/commitMessageService';

/**
 * Registers the 'sloth.generateCommit' command with VS Code extension context.
 */
export function registerGenerateCommitCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('sloth.generateCommit', async () => {
    try {
      const commitService = new CommitMessageService(undefined, context.workspaceState);
      const generatedMessage = await commitService.generateCommitMessage();
      const userMessage = await vscode.window.showInputBox({
        prompt: 'Review or edit the generated commit message',
        value: generatedMessage,
        placeHolder: 'Enter a commit message',
        ignoreFocusOut: true
      });

      if (userMessage === undefined) {
        return;
      }

      await vscode.env.clipboard.writeText(userMessage);
      void vscode.window.showInformationMessage('Commit message copied to clipboard.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error while generating commit message.';
      void vscode.window.showErrorMessage(`Sloth Generate Commit Error: ${message}`);
    }
  });

  context.subscriptions.push(disposable);
}

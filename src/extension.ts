import * as vscode from 'vscode';
import { registerHelloCommand } from './commands/hello';
import { registerStatusCommand } from './commands/status';
import { clearGitServiceCache } from './services/gitService';
import { getSlothOutputChannel } from './utils/outputChannel';

let hasShownSessionNotice = false;

export function activate(context: vscode.ExtensionContext): void {
  console.log('Sloth Activated');

  if (!hasShownSessionNotice) {
    hasShownSessionNotice = true;
    void vscode.window.showInformationMessage('Sloth Activated');
  }

  // Clear service cache whenever workspace folders change
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      clearGitServiceCache();
    }),
    getSlothOutputChannel()
  );

  registerHelloCommand(context);
  registerStatusCommand(context);
}

export function deactivate(): void {
  // Reserved for extension cleanup
}

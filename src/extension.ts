import * as vscode from 'vscode';
import { registerHelloCommand } from './commands/hello';

let hasShownSessionNotice = false;

export function activate(context: vscode.ExtensionContext): void {
  console.log('Sloth Activated');

  if (!hasShownSessionNotice) {
    hasShownSessionNotice = true;
    void vscode.window.showInformationMessage('Sloth Activated');
  }

  registerHelloCommand(context);
}

export function deactivate(): void {
  // Reserved for extension cleanup
}

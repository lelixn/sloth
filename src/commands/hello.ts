import * as vscode from 'vscode';

export function registerHelloCommand(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('sloth.hello', () => {
    console.log('[Sloth] Hello command executed');
    void vscode.window.showInformationMessage('🦥 Sloth is awake!');
  });

  context.subscriptions.push(disposable);
}

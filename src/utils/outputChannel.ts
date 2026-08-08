import * as vscode from 'vscode';

let slothOutputChannel: vscode.OutputChannel | null = null;

/**
 * Returns the singleton instance of the dedicated "Sloth" Output Channel.
 * Reuses the existing output channel across command executions.
 *
 * @returns The VS Code OutputChannel named "Sloth".
 */
export function getSlothOutputChannel(): vscode.OutputChannel {
  if (!slothOutputChannel) {
    slothOutputChannel = vscode.window.createOutputChannel('Sloth');
  }
  return slothOutputChannel;
}

/**
 * Clears and disposes the dedicated Sloth Output Channel (if initialized).
 */
export function disposeSlothOutputChannel(): void {
  if (slothOutputChannel) {
    slothOutputChannel.dispose();
    slothOutputChannel = null;
  }
}

import * as vscode from 'vscode';
import { getSlothOutputChannel } from './outputChannel';

/**
 * Compact 2D / ASCII Sloth identity logo.
 */
export const SLOTH_ASCII_ART = [
  '       .-""""-.       ',
  '      /  o  o  \\      ',
  '     |    --    |     ',
  '      \\  ----  /      ',
  '       \'------\'       ',
  '                      ',
  '          🦥          ',
  '       S L O T H      '
].join('\n');

/**
 * Standard monospaced terminal header banner.
 */
export const TERMINAL_HEADER = [
  '══════════════════════════════════════════',
  '        S L O T H  //  G I T',
  '══════════════════════════════════════════',
  '',
  '$ sloth commit',
  ''
].join('\n');

export type TerminalStepStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Data structure representing an individual step in the terminal execution log.
 */
export interface TerminalStep {
  id: string;
  label: string;
  status: TerminalStepStatus;
  animationFrame?: string;
  resultText?: string;
}

/**
 * Formatter and manager for the hacker terminal experience in VS Code Output Channel.
 */
export class SlothTerminal {
  private readonly steps: TerminalStep[] = [];
  private readonly outputChannel: vscode.OutputChannel;

  /**
   * Initializes a new instance of SlothTerminal.
   *
   * @param channel Optional VS Code OutputChannel provider. Defaults to the dedicated Sloth Output Channel.
   */
  constructor(channel?: vscode.OutputChannel) {
    this.outputChannel = channel ?? getSlothOutputChannel();
  }

  /**
   * Reveals the Sloth Output Channel in the VS Code panel without taking editor focus.
   */
  public show(): void {
    this.outputChannel.show(true);
  }

  /**
   * Renders the current state of the terminal log into the Output Channel.
   */
  public render(): void {
    const lines: string[] = [];

    lines.push(SLOTH_ASCII_ART);
    lines.push('');
    lines.push(TERMINAL_HEADER);

    for (const step of this.steps) {
      if (step.status === 'running') {
        const anim = step.animationFrame ? ` ${step.animationFrame}` : '';
        lines.push(`[${step.id}] ${step.label}${anim}`);
      } else if (step.status === 'completed') {
        lines.push(`[${step.id}] ${step.label}`);
        if (step.resultText) {
          lines.push(`[✓] ${step.resultText}`);
        }
        lines.push('');
      } else if (step.status === 'failed') {
        lines.push(`[${step.id}] ${step.label}`);
        if (step.resultText) {
          lines.push(`[✗] ${step.resultText}`);
        }
        lines.push('');
      }
    }

    this.outputChannel.clear();
    this.outputChannel.appendLine(lines.join('\n'));
  }

  /**
   * Adds a new step to the terminal log.
   *
   * @param id Step identifier (e.g. "01").
   * @param label Human-readable description of the step.
   * @returns Added TerminalStep object.
   */
  public addStep(id: string, label: string): TerminalStep {
    const step: TerminalStep = {
      id,
      label,
      status: 'pending'
    };
    this.steps.push(step);
    return step;
  }

  /**
   * Sets a step status to running and triggers a re-render.
   *
   * @param id Step identifier.
   * @param animationFrame Initial animation frame indicator.
   */
  public startStep(id: string, animationFrame?: string): void {
    const step = this.steps.find((s) => s.id === id);
    if (step) {
      step.status = 'running';
      step.animationFrame = animationFrame;
      this.render();
    }
  }

  /**
   * Updates the animation frame indicator for an active step.
   *
   * @param id Step identifier.
   * @param animationFrame New frame string.
   */
  public updateStepAnimation(id: string, animationFrame: string): void {
    const step = this.steps.find((s) => s.id === id);
    if (step && step.status === 'running') {
      step.animationFrame = animationFrame;
      this.render();
    }
  }

  /**
   * Marks a step as successfully completed with result text.
   *
   * @param id Step identifier.
   * @param resultText Success result message.
   */
  public completeStep(id: string, resultText: string): void {
    const step = this.steps.find((s) => s.id === id);
    if (step) {
      step.status = 'completed';
      step.animationFrame = undefined;
      step.resultText = resultText;
      this.render();
    }
  }

  /**
   * Marks a step as failed with an error description.
   *
   * @param id Step identifier.
   * @param errorText Failure message.
   */
  public failStep(id: string, errorText: string): void {
    const step = this.steps.find((s) => s.id === id);
    if (step) {
      step.status = 'failed';
      step.animationFrame = undefined;
      step.resultText = errorText;
      this.render();
    }
  }

  /**
   * Appends the final success banner to the Output Channel.
   *
   * @param commitHash Created commit short hash.
   * @param message Commit message string.
   */
  public showSuccessSummary(commitHash: string, message: string): void {
    const summaryLines = [
      '──────────────────────────────────────────',
      '',
      '🦥 SHIPPED LOCALLY',
      '',
      `commit: ${commitHash}`,
      `message: ${message}`,
      '',
      '══════════════════════════════════════════'
    ].join('\n');

    this.outputChannel.appendLine(summaryLines);
  }

  /**
   * Appends the commit failure error banner to the Output Channel.
   *
   * @param reason Failure explanation string.
   */
  public showErrorSummary(reason: string): void {
    const errorLines = [
      '══════════════════════════════════════════',
      '🦥 SLOTH // COMMIT FAILED',
      '══════════════════════════════════════════',
      '',
      '[✗] Commit failed',
      '',
      'Reason:',
      reason,
      '',
      'Check the Git output for details.',
      '',
      '══════════════════════════════════════════'
    ].join('\n');

    this.outputChannel.appendLine(errorLines);
  }
}

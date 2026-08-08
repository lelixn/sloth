/**
 * Animation frames used for terminal step progress indicators.
 */
const ANIMATION_FRAMES = ['[·]', '[··]', '[···]'];

/**
 * Options for configuring the terminal step animation helper.
 */
export interface SlothAnimationOptions {
  /**
   * Interval in milliseconds between animation frame updates.
   * @default 250
   */
  intervalMs?: number;
}

/**
 * Controller class for managing asynchronous text frame animations.
 * Provides clean start, stop, and disposal mechanics without memory leaks or infinite timers.
 */
export class SlothAnimationController {
  private timer: NodeJS.Timeout | null = null;
  private frameIndex: number = 0;
  private isRunning: boolean = false;

  /**
   * Initializes a new SlothAnimationController instance.
   *
   * @param onTick Callback invoked on each animation frame tick.
   * @param intervalMs Frame interval in milliseconds.
   */
  constructor(
    private readonly onTick: (frame: string) => void,
    private readonly intervalMs: number = 250
  ) {}

  /**
   * Starts the frame animation loop.
   */
  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.frameIndex = 0;
    this.onTick(ANIMATION_FRAMES[this.frameIndex]);

    this.timer = setInterval(() => {
      if (!this.isRunning) {
        return;
      }
      this.frameIndex = (this.frameIndex + 1) % ANIMATION_FRAMES.length;
      this.onTick(ANIMATION_FRAMES[this.frameIndex]);
    }, this.intervalMs);
  }

  /**
   * Stops the frame animation loop and clears active timers.
   */
  public stop(): void {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Disposes the controller instance.
   */
  public dispose(): void {
    this.stop();
  }
}

/**
 * Executes an asynchronous task while driving a frame-based animation loop.
 * Guarantees timer cleanup upon task resolution or rejection.
 *
 * @template T Return type of the asynchronous task.
 * @param onTick Callback function invoked on each animation frame tick with current frame string.
 * @param task Asynchronous function to execute.
 * @param options Optional configuration parameters.
 * @returns Promise resolving to the result of the asynchronous task.
 */
export async function runWithAnimation<T>(
  onTick: (frame: string) => void,
  task: () => Promise<T>,
  options?: SlothAnimationOptions
): Promise<T> {
  const controller = new SlothAnimationController(onTick, options?.intervalMs);
  controller.start();
  try {
    return await task();
  } finally {
    controller.stop();
    controller.dispose();
  }
}

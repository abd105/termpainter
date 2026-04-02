import { style } from './style.js';
import { isSilent } from './silent.js';
import { isTestMode } from './testmode.js';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export interface SpinnerHandle {
  succeed(msg?: string): void;
  fail(msg?: string): void;
  update(msg: string): void;
}

export function spin(msg: string): SpinnerHandle {
  if (isSilent()) {
    return {
      succeed(_?: string): void {},
      fail(_?: string): void {},
      update(_: string): void {},
    };
  }

  // Non-TTY and test mode: static single-line output, no animation
  if (!process.stdout.isTTY || isTestMode()) {
    process.stdout.write(style.muted(msg) + '\n');
    return {
      succeed(newMsg?: string): void {
        process.stdout.write(style.success(newMsg ?? msg) + '\n');
      },
      fail(newMsg?: string): void {
        process.stdout.write(style.error(newMsg ?? msg) + '\n');
      },
      update(newMsg: string): void {
        process.stdout.write(style.muted(newMsg) + '\n');
      },
    };
  }

  let currentMsg = msg;
  let i = 0;
  const timer = setInterval(() => {
    const frame = FRAMES[i % FRAMES.length];
    process.stdout.write(`\r\x1b[K${frame} ${currentMsg}`);
    i++;
  }, 80);

  function stop(output: string): void {
    clearInterval(timer);
    process.stdout.write(`\r\x1b[K${output}\n`);
  }

  return {
    succeed(newMsg?: string): void {
      stop(style.success(newMsg ?? currentMsg));
    },
    fail(newMsg?: string): void {
      stop(style.error(newMsg ?? currentMsg));
    },
    update(newMsg: string): void {
      currentMsg = newMsg;
    },
  };
}

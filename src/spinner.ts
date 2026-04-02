import { style } from './style.js';
import { isSilent } from './silent.js';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export interface SpinnerHandle {
  succeed(msg?: string): void;
  fail(msg?: string): void;
}

export function spin(msg: string): SpinnerHandle {
  if (isSilent()) {
    return {
      succeed(_?: string): void {},
      fail(_?: string): void {},
    };
  }

  if (!process.stdout.isTTY) {
    process.stdout.write(style.muted(msg) + '\n');
    return {
      succeed(newMsg?: string): void {
        process.stdout.write(style.success(newMsg ?? msg) + '\n');
      },
      fail(newMsg?: string): void {
        process.stdout.write(style.error(newMsg ?? msg) + '\n');
      },
    };
  }

  let i = 0;
  const timer = setInterval(() => {
    const frame = FRAMES[i % FRAMES.length];
    process.stdout.write(`\r\x1b[K${frame} ${msg}`);
    i++;
  }, 80);

  function stop(output: string): void {
    clearInterval(timer);
    process.stdout.write(`\r\x1b[K${output}\n`);
  }

  return {
    succeed(newMsg?: string): void {
      stop(style.success(newMsg ?? msg));
    },
    fail(newMsg?: string): void {
      stop(style.error(newMsg ?? msg));
    },
  };
}

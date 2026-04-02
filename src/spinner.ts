import { style } from './style.js';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export interface SpinnerHandle {
  succeed(msg?: string): void;
  fail(msg?: string): void;
}

export function spin(msg: string): SpinnerHandle {
  let i = 0;
  const timer = setInterval(() => {
    const frame = FRAMES[i % FRAMES.length];
    process.stdout.write(`\r${frame} ${msg}`);
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

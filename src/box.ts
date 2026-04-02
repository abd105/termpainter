import { type Color, fgMap } from './paint.js';
import { RESET } from './codes.js';
import { isColorEnabled } from './env.js';

export function box(text: string, color: Color = 'white'): string {
  const lines = text.split('\n');
  const width = Math.max(...lines.map((l) => l.length));

  if (!isColorEnabled()) {
    const top = `╭${'─'.repeat(width + 2)}╮`;
    const bottom = `╰${'─'.repeat(width + 2)}╯`;
    const middle = lines.map((line) => {
      const padding = ' '.repeat(width - line.length);
      return `│ ${line}${padding} │`;
    });
    return [top, ...middle, bottom].join('\n');
  }

  const c = fgMap[color];
  const top = `${c}╭${'─'.repeat(width + 2)}╮${RESET}`;
  const bottom = `${c}╰${'─'.repeat(width + 2)}╯${RESET}`;
  const middle = lines.map((line) => {
    const padding = ' '.repeat(width - line.length);
    return `${c}│${RESET} ${line}${padding} ${c}│${RESET}`;
  });

  return [top, ...middle, bottom].join('\n');
}

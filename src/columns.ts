import { strip } from './paint.js';
import { isInteractive } from './env.js';
import { isSilent } from './silent.js';

export interface ColumnsOptions {
  width?: number;
  gap?: number;
}

export function columns(left: string, right: string, options: ColumnsOptions = {}): string {
  if (isSilent()) return '';

  if (!isInteractive()) {
    return `${left}\n${right}`;
  }

  const totalWidth = options.width ?? 80;
  const gap = options.gap ?? 4;
  const colWidth = Math.floor((totalWidth - gap) / 2);
  const gapStr = ' '.repeat(gap);

  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const lineCount = Math.max(leftLines.length, rightLines.length);

  const result: string[] = [];
  for (let i = 0; i < lineCount; i++) {
    const l = leftLines[i] ?? '';
    const r = rightLines[i] ?? '';
    const visible = strip(l).length;
    const padding = visible < colWidth ? ' '.repeat(colWidth - visible) : '';
    result.push(`${l}${padding}${gapStr}${r}`);
  }

  return result.join('\n');
}

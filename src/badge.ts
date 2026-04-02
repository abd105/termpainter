import { type Color, fgMap } from './paint.js';
import { RESET } from './codes.js';
import { isColorEnabled } from './env.js';

export function badge(text: string, color: Color = 'white'): string {
  if (!isColorEnabled()) return `[${text}]`;
  const code = fgMap[color];
  return `${code}[${text}]${RESET}`;
}

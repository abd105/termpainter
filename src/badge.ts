import { type Color, fgMap } from './paint.js';
import { RESET } from './codes.js';
import { isColorEnabled } from './env.js';
import { isSilent } from './silent.js';

export function badge(text: string, color: Color = 'white'): string {
  if (isSilent()) return '';
  if (!isColorEnabled()) return `[${text}]`;
  const code = fgMap[color];
  return `${code}[${text}]${RESET}`;
}

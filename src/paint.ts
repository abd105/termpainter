import {
  RESET, BOLD, DIM, ITALIC, UNDERLINE,
  BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, GRAY,
  BG_BLACK, BG_RED, BG_GREEN, BG_YELLOW, BG_BLUE, BG_MAGENTA, BG_CYAN, BG_WHITE, BG_GRAY,
} from './codes.js';
import { isColorEnabled } from './env.js';
import { isSilent } from './silent.js';

export type Color = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';

export interface PaintOptions {
  color?: Color;
  bg?: Color;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
}

const fgMap: Record<Color, string> = {
  black: BLACK,
  red: RED,
  green: GREEN,
  yellow: YELLOW,
  blue: BLUE,
  magenta: MAGENTA,
  cyan: CYAN,
  white: WHITE,
  gray: GRAY,
};

const bgMap: Record<Color, string> = {
  black: BG_BLACK,
  red: BG_RED,
  green: BG_GREEN,
  yellow: BG_YELLOW,
  blue: BG_BLUE,
  magenta: BG_MAGENTA,
  cyan: BG_CYAN,
  white: BG_WHITE,
  gray: BG_GRAY,
};

export function paint(text: string, options: PaintOptions = {}): string {
  if (isSilent()) return '';
  if (!isColorEnabled()) return text;
  let prefix = '';
  if (options.bold) prefix += BOLD;
  if (options.dim) prefix += DIM;
  if (options.italic) prefix += ITALIC;
  if (options.underline) prefix += UNDERLINE;
  if (options.color) prefix += fgMap[options.color];
  if (options.bg) prefix += bgMap[options.bg];
  if (!prefix) return text;
  return `${prefix}${text}${RESET}`;
}

export function strip(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export { fgMap, bgMap };

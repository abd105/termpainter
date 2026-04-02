import { type Color, fgMap, strip } from './paint.js';
import { RESET } from './codes.js';
import { isColorEnabled } from './env.js';
import { isSilent } from './silent.js';

export interface BoxOptions {
  color?: Color;
  title?: string;
}

export function box(text: string, options?: Color | BoxOptions): string {
  if (isSilent()) return '';

  const color: Color = (typeof options === 'string' ? options : options?.color) ?? 'white';
  const title: string | undefined = typeof options === 'object' ? options.title : undefined;

  const lines = text.split('\n');
  const width = Math.max(...lines.map((l) => strip(l).length));

  function buildTop(colorCode?: string): string {
    const inner = width + 2; // total dashes without title
    if (title) {
      const titleSection = ` ${title} `;
      const dashes = Math.max(0, inner - titleSection.length);
      const raw = `╭${titleSection}${'─'.repeat(dashes)}╮`;
      return colorCode ? `${colorCode}${raw}${RESET}` : raw;
    }
    const raw = `╭${'─'.repeat(inner)}╮`;
    return colorCode ? `${colorCode}${raw}${RESET}` : raw;
  }

  if (!isColorEnabled()) {
    const top = buildTop();
    const bottom = `╰${'─'.repeat(width + 2)}╯`;
    const middle = lines.map((line) => {
      const padding = ' '.repeat(width - strip(line).length);
      return `│ ${line}${padding} │`;
    });
    return [top, ...middle, bottom].join('\n');
  }

  const c = fgMap[color];
  const top = buildTop(c);
  const bottom = `${c}╰${'─'.repeat(width + 2)}╯${RESET}`;
  const middle = lines.map((line) => {
    const padding = ' '.repeat(width - strip(line).length);
    return `${c}│${RESET} ${line}${padding} ${c}│${RESET}`;
  });

  return [top, ...middle, bottom].join('\n');
}

import { paint, type Color } from './paint.js';

export const style = {
  error(msg: string): string {
    return paint(`✖ ${msg}`, { color: 'red' });
  },
  success(msg: string): string {
    return paint(`✔ ${msg}`, { color: 'green' });
  },
  warn(msg: string): string {
    return paint(`⚠ ${msg}`, { color: 'yellow' });
  },
  info(msg: string): string {
    return paint(`ℹ ${msg}`, { color: 'blue' });
  },
  muted(msg: string): string {
    return paint(msg, { color: 'gray', dim: true });
  },
  bold(msg: string): string {
    return paint(msg, { color: 'white', bold: true });
  },
  highlight(msg: string): string {
    return paint(msg, { color: 'cyan' });
  },

  divider(color: Color = 'gray'): string {
    return paint('─'.repeat(40), { color });
  },

  table(data: Record<string, string>, color: Color = 'cyan'): string {
    const keys = Object.keys(data);
    if (keys.length === 0) return '';
    const keyWidth = Math.max(...keys.map((k) => k.length));
    return keys
      .map((key) => {
        const paddedKey = key.padEnd(keyWidth);
        return `${paint(paddedKey, { color })}  ${data[key]}`;
      })
      .join('\n');
  },

  timestamp(msg: string, color: Color = 'gray'): string {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const prefix = paint(`[${hh}:${mm}:${ss}]`, { color });
    return `${prefix} ${msg}`;
  },
};

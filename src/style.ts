import { paint, type Color } from './paint.js';
import { getIcons } from './icons.js';
import { isSilent } from './silent.js';

type Meta = Record<string, unknown>;

function formatMeta(data: Meta): string {
  const keys = Object.keys(data);
  if (keys.length === 0) return '';
  const keyWidth = Math.max(...keys.map((k) => k.length));
  return (
    '\n' +
    keys
      .map((key) => {
        const paddedKey = paint(key.padEnd(keyWidth), { color: 'cyan' });
        return `  ${paddedKey}  ${data[key]}`;
      })
      .join('\n')
  );
}

export const style = {
  error(msg: string, meta?: Meta): string {
    if (isSilent()) return '';
    return paint(`${getIcons().error} ${msg}`, { color: 'red' }) + (meta ? formatMeta(meta) : '');
  },
  success(msg: string, meta?: Meta): string {
    if (isSilent()) return '';
    return paint(`${getIcons().success} ${msg}`, { color: 'green' }) + (meta ? formatMeta(meta) : '');
  },
  warn(msg: string, meta?: Meta): string {
    if (isSilent()) return '';
    return paint(`${getIcons().warn} ${msg}`, { color: 'yellow' }) + (meta ? formatMeta(meta) : '');
  },
  info(msg: string, meta?: Meta): string {
    if (isSilent()) return '';
    return paint(`${getIcons().info} ${msg}`, { color: 'blue' }) + (meta ? formatMeta(meta) : '');
  },
  debug(msg: string, meta?: Meta): string {
    if (isSilent() || !process.env['DEBUG']) return '';
    return paint(`${getIcons().debug} ${msg}`, { color: 'gray', dim: true }) + (meta ? formatMeta(meta) : '');
  },
  muted(msg: string): string {
    if (isSilent()) return '';
    return paint(msg, { color: 'gray', dim: true });
  },
  bold(msg: string): string {
    if (isSilent()) return '';
    return paint(msg, { color: 'white', bold: true });
  },
  highlight(msg: string): string {
    if (isSilent()) return '';
    return paint(msg, { color: 'cyan' });
  },

  divider(color: Color = 'gray'): string {
    if (isSilent()) return '';
    return paint('─'.repeat(40), { color });
  },

  table(data: Record<string, string>, color: Color = 'cyan'): string {
    if (isSilent()) return '';
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
    if (isSilent()) return '';
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const prefix = paint(`[${hh}:${mm}:${ss}]`, { color });
    return `${prefix} ${msg}`;
  },

  group(label: string, lines: string[]): string {
    if (isSilent()) return '';
    const header = paint(`▶ ${label}`, { color: 'cyan' });
    const body = lines.map((line) => `  ${line}`).join('\n');
    return body.length > 0 ? `${header}\n${body}` : header;
  },
};

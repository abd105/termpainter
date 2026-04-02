import { paint, type Color } from './paint.js';
import { getIcons } from './icons.js';
import { getTheme } from './theme.js';
import { isSilent } from './silent.js';
import { isTestMode } from './testmode.js';

type Meta = Record<string, unknown>;

export interface ListOptions {
  bullet?: string;
  color?: Color;
  indent?: number;
}

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
    const t = getTheme().error;
    return paint(`${getIcons().error} ${msg}`, { color: t.color, dim: t.dim }) + (meta ? formatMeta(meta) : '');
  },
  success(msg: string, meta?: Meta): string {
    if (isSilent()) return '';
    const t = getTheme().success;
    return paint(`${getIcons().success} ${msg}`, { color: t.color, dim: t.dim }) + (meta ? formatMeta(meta) : '');
  },
  warn(msg: string, meta?: Meta): string {
    if (isSilent()) return '';
    const t = getTheme().warn;
    return paint(`${getIcons().warn} ${msg}`, { color: t.color, dim: t.dim }) + (meta ? formatMeta(meta) : '');
  },
  info(msg: string, meta?: Meta): string {
    if (isSilent()) return '';
    const t = getTheme().info;
    return paint(`${getIcons().info} ${msg}`, { color: t.color, dim: t.dim }) + (meta ? formatMeta(meta) : '');
  },
  debug(msg: string, meta?: Meta): string {
    if (isSilent() || !process.env['DEBUG']) return '';
    const t = getTheme().debug;
    return paint(`${getIcons().debug} ${msg}`, { color: t.color, dim: t.dim }) + (meta ? formatMeta(meta) : '');
  },
  muted(msg: string): string {
    if (isSilent()) return '';
    const t = getTheme().muted;
    return paint(msg, { color: t.color, dim: t.dim });
  },
  bold(msg: string): string {
    if (isSilent()) return '';
    return paint(msg, { color: 'white', bold: true });
  },
  highlight(msg: string): string {
    if (isSilent()) return '';
    const t = getTheme().highlight;
    return paint(msg, { color: t.color, dim: t.dim });
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
    if (isTestMode()) return msg;
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

  list(items: string[], options: ListOptions = {}): string {
    if (isSilent()) return '';
    const bullet = options.bullet ?? '•';
    const color: Color = options.color ?? 'cyan';
    const indent = options.indent ?? 0;
    const indentStr = ' '.repeat(indent);
    const coloredBullet = paint(bullet, { color });
    return items.map((item) => `${indentStr}${coloredBullet} ${item}`).join('\n');
  },
};

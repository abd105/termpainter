import type { Color } from './paint.js';
import { setIcons, resetIcons } from './icons.js';

export interface ThemeEntry {
  color?: Color;
  dim?: boolean;
  icon?: string;
}

export interface Theme {
  success?: ThemeEntry;
  error?: ThemeEntry;
  warn?: ThemeEntry;
  info?: ThemeEntry;
  debug?: ThemeEntry;
  muted?: ThemeEntry;
  highlight?: ThemeEntry;
}

interface ResolvedEntry {
  color: Color;
  dim: boolean;
}

type ResolvedTheme = { [K in keyof Required<Theme>]: ResolvedEntry };

const defaults: ResolvedTheme = {
  success:   { color: 'green',  dim: false },
  error:     { color: 'red',    dim: false },
  warn:      { color: 'yellow', dim: false },
  info:      { color: 'blue',   dim: false },
  debug:     { color: 'gray',   dim: true  },
  muted:     { color: 'gray',   dim: true  },
  highlight: { color: 'cyan',   dim: false },
};

let current: ResolvedTheme = { ...defaults };

export function setTheme(theme: Partial<Theme>): void {
  // Always start from defaults so each setTheme() call is a clean override
  current = { ...defaults };
  const iconPatch: Partial<{ error: string; success: string; warn: string; info: string; debug: string }> = {};
  resetIcons();

  for (const _key of Object.keys(theme) as (keyof Theme)[]) {
    const entry = theme[_key];
    if (!entry) continue;
    current[_key] = {
      color: entry.color ?? defaults[_key].color,
      dim: entry.dim ?? defaults[_key].dim,
    };
    if (entry.icon !== undefined && (_key === 'error' || _key === 'success' || _key === 'warn' || _key === 'info' || _key === 'debug')) {
      iconPatch[_key] = entry.icon;
    }
  }

  if (Object.keys(iconPatch).length > 0) {
    setIcons(iconPatch);
  }
}

export function resetTheme(): void {
  current = { ...defaults };
  resetIcons();
}

export function getTheme(): ResolvedTheme {
  return current;
}

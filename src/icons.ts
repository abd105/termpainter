export interface Icons {
  error: string;
  success: string;
  warn: string;
  info: string;
  debug: string;
}

const defaults: Icons = {
  error: '✖',
  success: '✔',
  warn: '⚠',
  info: 'ℹ',
  debug: '🔍',
};

let current: Icons = { ...defaults };

export function setIcons(icons: Partial<Icons>): void {
  current = { ...defaults, ...icons };
}

export function getIcons(): Icons {
  return current;
}

export function resetIcons(): void {
  current = { ...defaults };
}

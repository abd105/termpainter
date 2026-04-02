import { strip } from './paint.js';

export function truncate(str: string, maxLength: number): string {
  if (strip(str).length <= maxLength) return str;
  if (maxLength <= 0) return '…';

  const limit = maxLength - 1; // reserve 1 char for '…'
  let visible = 0;
  let i = 0;

  while (i < str.length && visible < limit) {
    const m = str.slice(i).match(/^\x1b\[[0-9;]*m/);
    if (m) {
      i += m[0].length;
    } else {
      visible++;
      i++;
    }
  }

  const cut = str.slice(0, i);
  const needsReset = cut !== strip(cut);
  return needsReset ? `${cut}\x1b[0m…` : `${cut}…`;
}

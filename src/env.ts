/**
 * Returns true if ANSI color codes should be emitted.
 * Colors are disabled when any of the following are true:
 *   - NO_COLOR env var is set (https://no-color.org)
 *   - CI env var is set (raw escape codes look broken in most CI logs)
 *   - process.stdout.isTTY is false/undefined (output is being piped)
 */
export function isInteractive(): boolean {
  return process.stdout.isTTY === true;
}

export function isColorEnabled(): boolean {
  if (process.env.NO_COLOR !== undefined) return false;
  if (process.env.CI !== undefined) return false;
  if (!process.stdout.isTTY) return false;
  return true;
}

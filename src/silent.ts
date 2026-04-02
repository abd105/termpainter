let silentMode = false;

export function setSilent(mode: boolean): void {
  silentMode = mode;
}

export function isSilent(): boolean {
  return silentMode;
}

let testModeEnabled = false;

export function setTestMode(enabled: boolean): void {
  testModeEnabled = enabled;
}

export function isTestMode(): boolean {
  return testModeEnabled;
}

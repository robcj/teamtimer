/**
 * Use this to detect whether the code is running in a mobile app rather than a web page.
 * This is not a perfect test, but it should be good enough for our purposes.
 * It checks for the presence of the Capacitor runtime, and if it finds it, it checks whether
 * the runtime indicates that it's running on a native platform.
 *
 * @returns {boolean} True if running in a mobile app, false otherwise.
 */
function hasCapacitorRuntime(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const maybeCapacitor = window.Capacitor;
  if (!maybeCapacitor) {
    return false;
  }

  if (typeof maybeCapacitor.isNativePlatform === 'function') {
    return maybeCapacitor.isNativePlatform();
  }

  return typeof maybeCapacitor.getPlatform === 'function'
    ? maybeCapacitor.getPlatform() !== 'web'
    : false;
}

export function isMobileApp(): boolean {
  return hasCapacitorRuntime();
}

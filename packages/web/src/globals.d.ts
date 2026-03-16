declare const __GIT_TAG__: string;
declare const __GIT_COMMIT__: string;

interface Window {
  Capacitor?: {
    getPlatform?: () => string;
    isNativePlatform?: () => boolean;
  };
}

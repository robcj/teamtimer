import { useEffect, useRef } from 'react';

type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener: (type: 'release', listener: () => void) => void;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<WakeLockSentinelLike>;
  };
};

export const useWakeLock = (enabled: boolean): void => {
  const wakeLockRef = useRef<WakeLockSentinelLike | null>(null);
  const enabledRef = useRef<boolean>(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const requestWakeLock = async (): Promise<void> => {
      if (!enabledRef.current || document.visibilityState !== 'visible') {
        return;
      }

      const navigatorWithWakeLock = navigator as NavigatorWithWakeLock;
      if (!navigatorWithWakeLock.wakeLock) {
        return;
      }

      if (wakeLockRef.current && !wakeLockRef.current.released) {
        return;
      }

      try {
        const lock = await navigatorWithWakeLock.wakeLock.request('screen');
        wakeLockRef.current = lock;
        lock.addEventListener('release', () => {
          wakeLockRef.current = null;
        });
      } catch {
        wakeLockRef.current = null;
      }
    };

    const releaseWakeLock = async (): Promise<void> => {
      if (!wakeLockRef.current) {
        return;
      }

      try {
        await wakeLockRef.current.release();
      } catch {
      } finally {
        wakeLockRef.current = null;
      }
    };

    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'visible') {
        void requestWakeLock();
      }
    };

    if (enabled) {
      void requestWakeLock();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      void releaseWakeLock();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void releaseWakeLock();
    };
  }, [enabled]);
};

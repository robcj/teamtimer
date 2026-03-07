import { useEffect, useState } from 'react';

interface AggregateState {
  hasStartedGames: boolean;
  allStartedGamesPaused: boolean;
}

interface StoredTimerState {
  isRunning?: boolean;
  isPaused?: boolean;
}

export const useGlobalTimerAggregateState = (
  locations: string[],
  getLocationTimerStorageKey: (location: string) => string
): AggregateState => {
  const [hasStartedGames, setHasStartedGames] = useState<boolean>(false);
  const [allStartedGamesPaused, setAllStartedGamesPaused] = useState<boolean>(false);

  useEffect(() => {
    const detectTimerAggregateState = (): { hasStarted: boolean; allPaused: boolean } => {
      let activeCount = 0;
      let pausedCount = 0;

      locations.forEach(location => {
        const rawState = localStorage.getItem(getLocationTimerStorageKey(location));
        if (!rawState) {
          return;
        }

        try {
          const parsed = JSON.parse(rawState) as StoredTimerState;
          const isActive = Boolean(parsed.isRunning) || Boolean(parsed.isPaused);

          if (isActive) {
            activeCount += 1;
            if (Boolean(parsed.isPaused)) {
              pausedCount += 1;
            }
          }
        } catch {}
      });

      return {
        hasStarted: activeCount > 0,
        allPaused: activeCount > 0 && pausedCount === activeCount,
      };
    };

    const updateDetectedState = (): void => {
      const state = detectTimerAggregateState();
      setHasStartedGames(state.hasStarted);
      setAllStartedGamesPaused(state.allPaused);
    };

    updateDetectedState();
    const interval = setInterval(() => {
      updateDetectedState();
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [locations, getLocationTimerStorageKey]);

  return {
    hasStartedGames,
    allStartedGamesPaused,
  };
};

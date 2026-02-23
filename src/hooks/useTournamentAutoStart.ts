import { useEffect, useRef } from 'react';

interface UseTournamentAutoStartParams {
  tournamentStartAt?: string;
  isDisplayOnly: boolean;
  onStartAll: () => void;
}

export const useTournamentAutoStart = ({
  tournamentStartAt,
  isDisplayOnly,
  onStartAll,
}: UseTournamentAutoStartParams): void => {
  const autoStartedTournamentAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (isDisplayOnly) {
      return;
    }

    const trimmedTournamentStartAt = tournamentStartAt?.trim();
    if (!trimmedTournamentStartAt) {
      autoStartedTournamentAtRef.current = null;
      return;
    }

    const startTimestamp = new Date(trimmedTournamentStartAt).getTime();
    if (!Number.isFinite(startTimestamp)) {
      return;
    }

    if (autoStartedTournamentAtRef.current === trimmedTournamentStartAt) {
      return;
    }

    const startAllNow = (): void => {
      onStartAll();
      autoStartedTournamentAtRef.current = trimmedTournamentStartAt;
    };

    if (Date.now() >= startTimestamp) {
      startAllNow();
      return;
    }

    const interval = setInterval(() => {
      if (Date.now() >= startTimestamp && Date.now() <= startTimestamp + 5000) {
        startAllNow();
        clearInterval(interval);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [tournamentStartAt, isDisplayOnly, onStartAll]);
};

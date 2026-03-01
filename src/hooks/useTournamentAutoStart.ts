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
      return;
    }

    const timeoutDelay = Math.max(startTimestamp - Date.now(), 0);
    const timeout = window.setTimeout(() => {
      if (autoStartedTournamentAtRef.current !== trimmedTournamentStartAt) {
        startAllNow();
      }
    }, timeoutDelay);

    return () => {
      clearTimeout(timeout);
    };
  }, [tournamentStartAt, isDisplayOnly, onStartAll]);
};

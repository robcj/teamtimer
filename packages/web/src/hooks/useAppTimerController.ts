import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { LocationStartTimes } from '@team-timer/core';

interface UseAppTimerControllerParams {
  tournamentStartAt?: string;
  locations: string[];
  selectedLocation: string;
  setLocationStartTimes: Dispatch<SetStateAction<LocationStartTimes>>;
  hasStartedGames: boolean;
  allStartedGamesPaused: boolean;
}

interface UseAppTimerControllerResult {
  startAllSignal: number;
  pauseAllSignal: number;
  resumeAllSignal: number;
  resetAllSignal: number;
  globalControlLabel: 'Start All' | 'Pause All' | 'Resume All';
  handleOpenSecondScreen: () => void;
  handleLocationManualStart: (location: string) => void;
  handleStartAll: () => void;
  handlePauseAll: () => void;
  handleResumeAll: () => void;
  handleAutoStartAll: () => void;
  handleResetAll: () => void;
  handleGlobalControl: () => void;
}

export const useAppTimerController = ({
  tournamentStartAt,
  locations,
  selectedLocation,
  setLocationStartTimes,
  hasStartedGames,
  allStartedGamesPaused,
}: UseAppTimerControllerParams): UseAppTimerControllerResult => {
  const [startAllSignal, setStartAllSignal] = useState<number>(0);
  const [pauseAllSignal, setPauseAllSignal] = useState<number>(0);
  const [resumeAllSignal, setResumeAllSignal] = useState<number>(0);
  const [resetAllSignal, setResetAllSignal] = useState<number>(0);

  const handleOpenSecondScreen = useCallback((): void => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'display');

    if (locations.length > 1) {
      const optionsText = locations
        .map((location, index) => `${index + 1}. ${location}`)
        .join('\n');
      const choice = window.prompt(
        `Open additional screen for which location?\n\n${optionsText}\n\nType a number, or type "all" for split screen.`,
        selectedLocation ? String(locations.indexOf(selectedLocation) + 1) : '1'
      );

      if (!choice) {
        return;
      }

      if (choice.trim().toLowerCase() === 'all') {
        url.searchParams.set('layout', 'split');
        url.searchParams.delete('location');
      } else {
        const indexChoice = Number(choice.trim());
        const locationChoice = Number.isInteger(indexChoice)
          ? locations[indexChoice - 1]
          : locations.find(location => location.toLowerCase() === choice.trim().toLowerCase());

        if (!locationChoice) {
          alert('Invalid location choice.');
          return;
        }

        url.searchParams.set('layout', 'single');
        url.searchParams.set('location', locationChoice);
      }
    } else {
      url.searchParams.set('layout', 'single');
      url.searchParams.set('location', locations[0]);
    }

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  }, [locations, selectedLocation]);

  const handleLocationManualStart = useCallback(
    (location: string): void => {
      if (tournamentStartAt?.trim()) {
        return;
      }
      setLocationStartTimes(prev => ({ ...prev, [location]: Date.now() }));
    },
    [tournamentStartAt, setLocationStartTimes]
  );

  const handleStartAll = useCallback((): void => {
    const now = Date.now();
    if (!tournamentStartAt?.trim()) {
      const nextStartTimes = locations.reduce<LocationStartTimes>((acc, location) => {
        acc[location] = now;
        return acc;
      }, {});
      setLocationStartTimes(prev => ({ ...prev, ...nextStartTimes }));
    }
    setStartAllSignal(prev => prev + 1);
  }, [tournamentStartAt, locations, setLocationStartTimes]);

  const handlePauseAll = useCallback((): void => {
    setPauseAllSignal(prev => prev + 1);
  }, []);

  const handleResumeAll = useCallback((): void => {
    setResumeAllSignal(prev => prev + 1);
  }, []);

  const handleAutoStartAll = useCallback((): void => {
    setStartAllSignal(prev => prev + 1);
  }, []);

  const handleResetAll = useCallback((): void => {
    const confirmed = window.confirm(
      'This will reset all times and scores for every location. Are you sure you want to continue?'
    );
    if (!confirmed) {
      return;
    }

    setLocationStartTimes({});
    setResetAllSignal(prev => prev + 1);
  }, [setLocationStartTimes]);

  const globalControlLabel: 'Start All' | 'Pause All' | 'Resume All' = !hasStartedGames
    ? 'Start All'
    : allStartedGamesPaused
      ? 'Resume All'
      : 'Pause All';

  const handleGlobalControl = useCallback((): void => {
    if (!hasStartedGames) {
      handleStartAll();
      return;
    }
    if (allStartedGamesPaused) {
      handleResumeAll();
      return;
    }
    handlePauseAll();
  }, [hasStartedGames, allStartedGamesPaused, handleStartAll, handleResumeAll, handlePauseAll]);

  return {
    startAllSignal,
    pauseAllSignal,
    resumeAllSignal,
    resetAllSignal,
    globalControlLabel,
    handleOpenSecondScreen,
    handleLocationManualStart,
    handleStartAll,
    handlePauseAll,
    handleResumeAll,
    handleAutoStartAll,
    handleResetAll,
    handleGlobalControl,
  };
};

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { GameResult, Scores, TimerConfig, TimerState } from '../types';
import { createEmptyResults } from '../utils/gameResults';
import { formatClockTime } from '../utils/time';
import { playTimerTone, TimerToneStyle } from '../utils/audio';

interface UseGameTimerResult {
  currentGameIndex: number;
  gameResults: GameResult[];
  phase: string;
  setPhase: Dispatch<SetStateAction<string>>;
  timeRemaining: number;
  setTimeRemaining: Dispatch<SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  isPaused: boolean;
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  scores: Scores;
  setScores: Dispatch<SetStateAction<Scores>>;
  handleNextGame: () => void;
  handlePrevGame: () => void;
  handleResetGame: () => void;
  handleResetTimer: () => void;
}

interface UseGameTimerOptions {
  readOnlyMirror?: boolean;
  storageKey?: string;
  externalStartSignal?: number;
  externalResetSignal?: number;
}

export const useGameTimer = (
  config: TimerConfig,
  options: UseGameTimerOptions = {}
): UseGameTimerResult => {
  const {
    readOnlyMirror = false,
    storageKey = 'teamTimerState',
    externalStartSignal = 0,
    externalResetSignal = 0,
  } = options;
  const [timerState, setTimerState] = useState<TimerState | null>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  });

  const [currentGameIndex, setCurrentGameIndex] = useState<number>(
    () => timerState?.currentGameIndex ?? 0
  );
  const [phase, setPhase] = useState<string>(() => timerState?.phase || 'idle');
  const [timeRemaining, setTimeRemaining] = useState<number>(() => timerState?.timeRemaining || 0);
  const [isRunning, setIsRunning] = useState<boolean>(() => timerState?.isRunning || false);
  const [isPaused, setIsPaused] = useState<boolean>(() => timerState?.isPaused || false);
  const [scores, setScores] = useState<Scores>(() => timerState?.scores || { team1: 0, team2: 0 });
  const [gameResults, setGameResults] = useState<GameResult[]>(() => {
    if (timerState?.gameResults && Array.isArray(timerState.gameResults)) {
      return timerState.gameResults;
    }
    return createEmptyResults(config.games);
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoStartIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastExternalStartSignalRef = useRef<number>(externalStartSignal);
  const lastExternalResetSignalRef = useRef<number>(externalResetSignal);
  const prevPhaseRef = useRef<string>(phase);
  const isLoadingScoresRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const resetState = (): void => {
    setPhase('idle');
    setTimeRemaining(0);
    setIsRunning(false);
    setIsPaused(false);
    setScores({ team1: 0, team2: 0 });
    setCurrentGameIndex(0);
    setGameResults(createEmptyResults(config.games));
    setTimerState(null);
    localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    setGameResults(prev =>
      config.games.map((_, index) => prev[index] ?? { startTime: null, score: null })
    );
    setCurrentGameIndex(prev => Math.min(prev, Math.max(config.games.length - 1, 0)));
  }, [config.games.length]);

  useEffect(() => {
    if (readOnlyMirror || config.games.length === 0) {
      return;
    }
    if (externalStartSignal === 0 || externalStartSignal === lastExternalStartSignalRef.current) {
      return;
    }

    lastExternalStartSignalRef.current = externalStartSignal;

    if (phase === 'idle') {
      setPhase('countdown');
      setTimeRemaining(config.countdownToStart);
      setIsRunning(true);
      setIsPaused(false);
    }
  }, [externalStartSignal, readOnlyMirror, config.games.length, phase, config.countdownToStart]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (externalResetSignal === 0 || externalResetSignal === lastExternalResetSignalRef.current) {
      return;
    }

    lastExternalResetSignalRef.current = externalResetSignal;
    resetState();
  }, [externalResetSignal, readOnlyMirror, config.games.length, storageKey]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (
      isRunning ||
      isPaused ||
      phase !== 'idle' ||
      timeRemaining > 0 ||
      scores.team1 > 0 ||
      scores.team2 > 0 ||
      gameResults.some(result => result.startTime || result.score)
    ) {
      const newState: TimerState = {
        phase,
        timeRemaining,
        isRunning,
        isPaused,
        scores,
        currentGameIndex,
        gameResults,
      };
      setTimerState(newState);
      localStorage.setItem(storageKey, JSON.stringify(newState));
    }
  }, [
    phase,
    timeRemaining,
    isRunning,
    isPaused,
    scores,
    currentGameIndex,
    gameResults,
    readOnlyMirror,
    storageKey,
  ]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    const prevPhase = prevPhaseRef.current;

    if (phase === 'firstHalf' && prevPhase !== 'firstHalf') {
      setGameResults(prev => {
        if (currentGameIndex < 0 || currentGameIndex >= prev.length) {
          return prev;
        }
        const next = [...prev];
        const current = next[currentGameIndex] ?? { startTime: null, score: null };
        if (!current.startTime) {
          next[currentGameIndex] = { ...current, startTime: formatClockTime(new Date()) };
        }
        return next;
      });
    }

    if (prevPhase === 'secondHalf' && phase === 'betweenGames') {
      setGameResults(prev => {
        if (currentGameIndex < 0 || currentGameIndex >= prev.length) {
          return prev;
        }
        const next = [...prev];
        const current = next[currentGameIndex] ?? { startTime: null, score: null };
        next[currentGameIndex] = { ...current, score: { ...scores } };
        return next;
      });
    }

    prevPhaseRef.current = phase;
  }, [phase, currentGameIndex, scores, readOnlyMirror]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (phase === 'idle' || phase === 'betweenGames') {
      isLoadingScoresRef.current = true;
      const currentGameResult = gameResults[currentGameIndex];
      if (currentGameResult?.score) {
        setScores(currentGameResult.score);
      } else {
        setScores({ team1: 0, team2: 0 });
      }
      setTimeout(() => {
        isLoadingScoresRef.current = false;
      }, 0);
    }
  }, [currentGameIndex, phase, gameResults.length, readOnlyMirror]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (
      !isLoadingScoresRef.current &&
      (phase === 'idle' || phase === 'betweenGames') &&
      currentGameIndex >= 0
    ) {
      setGameResults(prev => {
        const next = [...prev];
        const current = next[currentGameIndex] ?? { startTime: null, score: null };
        if (
          !current.score ||
          current.score.team1 !== scores.team1 ||
          current.score.team2 !== scores.team2
        ) {
          next[currentGameIndex] = { ...current, score: { ...scores } };
        }
        return next;
      });
    }
  }, [scores, phase, currentGameIndex, readOnlyMirror]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (config.games.length === 0) {
      return;
    }

    const tournamentStartAt = config.tournamentStartAt?.trim();
    if (!tournamentStartAt) {
      return;
    }

    const startTimestamp = new Date(tournamentStartAt).getTime();
    if (!Number.isFinite(startTimestamp)) {
      return;
    }

    const hasStartedAnyGame = gameResults.some(result => result.startTime || result.score);
    if (hasStartedAnyGame || currentGameIndex !== 0) {
      return;
    }

    const startCountdown = (secondsRemaining: number): void => {
      setPhase('countdown');
      setTimeRemaining(Math.max(1, secondsRemaining));
      setIsRunning(true);
      setIsPaused(false);
    };

    const tick = (): boolean => {
      const now = Date.now();
      const countdownStartTimestamp = startTimestamp - config.countdownToStart * 1000;

      if (now >= startTimestamp) {
        const elapsedSeconds = Math.floor((now - startTimestamp) / 1000);
        const firstHalfRemaining = Math.max(config.firstHalfDuration - elapsedSeconds, 0);

        if (firstHalfRemaining > 0) {
          setPhase('firstHalf');
          setTimeRemaining(firstHalfRemaining);
          setIsRunning(true);
          setIsPaused(false);
        }
        return true;
      }

      if (now >= countdownStartTimestamp) {
        const secondsUntilStart = Math.ceil((startTimestamp - now) / 1000);
        startCountdown(secondsUntilStart);
        return true;
      }

      return false;
    };

    if (autoStartIntervalRef.current) {
      clearInterval(autoStartIntervalRef.current);
      autoStartIntervalRef.current = null;
    }

    if (tick()) {
      return;
    }

    autoStartIntervalRef.current = setInterval(() => {
      if (tick() && autoStartIntervalRef.current) {
        clearInterval(autoStartIntervalRef.current);
        autoStartIntervalRef.current = null;
      }
    }, 500);

    return () => {
      if (autoStartTimeoutRef.current) {
        clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }
      if (autoStartIntervalRef.current) {
        clearInterval(autoStartIntervalRef.current);
        autoStartIntervalRef.current = null;
      }
    };
  }, [
    config.tournamentStartAt,
    config.countdownToStart,
    config.firstHalfDuration,
    config.games.length,
    readOnlyMirror,
    phase,
    currentGameIndex,
    gameResults,
  ]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (isRunning && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (autoStartTimeoutRef.current) {
        clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }
      if (autoStartIntervalRef.current) {
        clearInterval(autoStartIntervalRef.current);
        autoStartIntervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, readOnlyMirror]);

  const playBeep = (duration = 0.1, style: TimerToneStyle = 'beep'): void => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    playTimerTone(audioContextRef.current, duration, style);
  };

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (isRunning && !isPaused && timeRemaining <= 5 && timeRemaining > 0) {
      playBeep();
    }
  }, [timeRemaining, isRunning, isPaused, readOnlyMirror]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (timeRemaining === 0 && isRunning && !isPaused && phase !== 'idle') {
      playBeep(2, 'siren');

      switch (phase) {
        case 'countdown':
          setPhase('firstHalf');
          setTimeRemaining(config.firstHalfDuration);
          break;
        case 'firstHalf':
          setPhase('halfTime');
          setTimeRemaining(config.halfTimeDuration);
          break;
        case 'halfTime':
          setPhase('secondHalf');
          setTimeRemaining(config.secondHalfDuration);
          break;
        case 'secondHalf':
          setPhase('betweenGames');
          setTimeRemaining(config.betweenGamesDuration);
          break;
        case 'betweenGames':
          if (currentGameIndex < config.games.length - 1) {
            setCurrentGameIndex(currentGameIndex + 1);
            setScores({ team1: 0, team2: 0 });
            setPhase('firstHalf');
            setTimeRemaining(config.firstHalfDuration);
          } else {
            setPhase('idle');
            setIsRunning(false);
            setTimeRemaining(0);
          }
          break;
        default:
          break;
      }
    }
  }, [timeRemaining, phase, isRunning, isPaused, config, currentGameIndex, readOnlyMirror]);

  useEffect(() => {
    if (!readOnlyMirror) {
      return;
    }

    const applyExternalState = (nextState: TimerState | null): void => {
      if (!nextState) {
        setPhase('idle');
        setTimeRemaining(0);
        setIsRunning(false);
        setIsPaused(false);
        setScores({ team1: 0, team2: 0 });
        setCurrentGameIndex(0);
        setGameResults(createEmptyResults(config.games));
        setTimerState(null);
        return;
      }

      setPhase(nextState.phase || 'idle');
      setTimeRemaining(nextState.timeRemaining || 0);
      setIsRunning(Boolean(nextState.isRunning));
      setIsPaused(Boolean(nextState.isPaused));
      setScores(nextState.scores || { team1: 0, team2: 0 });
      setCurrentGameIndex(
        Math.min(nextState.currentGameIndex ?? 0, Math.max(config.games.length - 1, 0))
      );
      setGameResults(
        config.games.map(
          (_, index) => nextState.gameResults?.[index] ?? { startTime: null, score: null }
        )
      );
      setTimerState(nextState);
    };

    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      try {
        applyExternalState(JSON.parse(savedState) as TimerState);
      } catch {
        applyExternalState(null);
      }
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== storageKey) {
        return;
      }

      if (!event.newValue) {
        applyExternalState(null);
        return;
      }

      try {
        applyExternalState(JSON.parse(event.newValue) as TimerState);
      } catch {
        applyExternalState(null);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [readOnlyMirror, config.games, storageKey]);

  const handleNextGame = (): void => {
    if (currentGameIndex < config.games.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    }
  };

  const handlePrevGame = (): void => {
    if (currentGameIndex > 0) {
      setCurrentGameIndex(currentGameIndex - 1);
    }
  };

  const handleResetGame = (): void => {
    setCurrentGameIndex(0);
  };

  const handleResetTimer = (): void => {
    const confirmed = window.confirm(
      'This will reset all times and scores. Are you sure you want to continue?'
    );
    if (!confirmed) {
      return;
    }

    resetState();
  };

  return {
    currentGameIndex,
    gameResults,
    phase,
    setPhase,
    timeRemaining,
    setTimeRemaining,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    scores,
    setScores,
    handleNextGame,
    handlePrevGame,
    handleResetGame,
    handleResetTimer,
  };
};

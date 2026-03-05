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
  selectedLocation?: string;
  readOnlyMirror?: boolean;
  storageKey?: string;
  externalStartSignal?: number;
  externalResetSignal?: number;
  externalPauseSignal?: number;
  externalResumeSignal?: number;
  loopGames?: boolean;
}

const createInitialResults = (games: TimerConfig['games'], loopGames: boolean): GameResult[] =>
  loopGames ? [] : createEmptyResults(games);

export const useGameTimer = (
  config: TimerConfig,
  options: UseGameTimerOptions = {}
): UseGameTimerResult => {
  const {
    selectedLocation,
    readOnlyMirror = false,
    storageKey = 'teamTimerState',
    externalStartSignal = 0,
    externalResetSignal = 0,
    externalPauseSignal = 0,
    externalResumeSignal = 0,
    loopGames = false,
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
    return createInitialResults(config.games, loopGames);
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastExternalStartSignalRef = useRef<number>(externalStartSignal);
  const lastExternalResetSignalRef = useRef<number>(externalResetSignal);
  const lastExternalPauseSignalRef = useRef<number>(externalPauseSignal);
  const lastExternalResumeSignalRef = useRef<number>(externalResumeSignal);
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
    setGameResults(createInitialResults(config.games, loopGames));
    setTimerState(null);
    localStorage.removeItem(storageKey);
  };

  useEffect(() => {
    if (loopGames) {
      return;
    }

    setGameResults(prev =>
      config.games.map((_, index) => prev[index] ?? { startTime: null, score: null })
    );
    setCurrentGameIndex(prev => Math.min(prev, Math.max(config.games.length - 1, 0)));
  }, [config.games.length, loopGames]);

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
    if (externalPauseSignal === 0 || externalPauseSignal === lastExternalPauseSignalRef.current) {
      return;
    }

    lastExternalPauseSignalRef.current = externalPauseSignal;
    if (phase !== 'idle' && isRunning && !isPaused) {
      setIsPaused(true);
    }
  }, [externalPauseSignal, readOnlyMirror, phase, isRunning, isPaused]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (
      externalResumeSignal === 0 ||
      externalResumeSignal === lastExternalResumeSignalRef.current
    ) {
      return;
    }

    lastExternalResumeSignalRef.current = externalResumeSignal;
    if (phase !== 'idle' && isRunning && isPaused) {
      setIsPaused(false);
    }
  }, [externalResumeSignal, readOnlyMirror, phase, isRunning, isPaused]);

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
        if (loopGames) {
          return [...prev, { startTime: formatClockTime(new Date()), score: null }];
        }

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
        const resultIndex = loopGames ? prev.length - 1 : currentGameIndex;
        if (resultIndex < 0 || resultIndex >= prev.length) {
          return prev;
        }
        const next = [...prev];
        const current = next[resultIndex] ?? { startTime: null, score: null };
        next[resultIndex] = { ...current, score: { ...scores } };
        return next;
      });
    }

    prevPhaseRef.current = phase;
  }, [phase, currentGameIndex, scores, readOnlyMirror, loopGames]);

  useEffect(() => {
    if (readOnlyMirror) {
      return;
    }
    if (phase === 'idle' || phase === 'betweenGames') {
      isLoadingScoresRef.current = true;
      const resultIndex = loopGames
        ? Math.max(gameResults.length - 1, 0)
        : Math.max(currentGameIndex, 0);
      const currentGameResult = gameResults[resultIndex];
      if (currentGameResult?.score) {
        setScores(currentGameResult.score);
      } else {
        setScores({ team1: 0, team2: 0 });
      }
      setTimeout(() => {
        isLoadingScoresRef.current = false;
      }, 0);
    }
  }, [currentGameIndex, phase, gameResults, readOnlyMirror, loopGames]);

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
        const resultIndex = loopGames ? prev.length - 1 : currentGameIndex;
        if (resultIndex < 0) {
          return prev;
        }
        const next = [...prev];
        const current = next[resultIndex] ?? { startTime: null, score: null };
        if (
          !current.score ||
          current.score.team1 !== scores.team1 ||
          current.score.team2 !== scores.team2
        ) {
          next[resultIndex] = { ...current, score: { ...scores } };
        }
        return next;
      });
    }
  }, [scores, phase, currentGameIndex, readOnlyMirror, loopGames]);

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
          setTimeRemaining(config.gameHalfDuration);
          break;
        case 'firstHalf':
          setPhase('halfTime');
          setTimeRemaining(config.halfTimeDuration);
          break;
        case 'halfTime':
          setPhase('secondHalf');
          setTimeRemaining(config.gameHalfDuration);
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
            setTimeRemaining(config.gameHalfDuration);
          } else if (loopGames && config.games.length > 0) {
            setCurrentGameIndex(0);
            setScores({ team1: 0, team2: 0 });
            setPhase('firstHalf');
            setTimeRemaining(config.gameHalfDuration);
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
        setGameResults(createInitialResults(config.games, loopGames));
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
        loopGames
          ? Array.isArray(nextState.gameResults)
            ? nextState.gameResults
            : []
          : config.games.map(
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
  }, [readOnlyMirror, config.games, storageKey, loopGames]);

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
      `This will reset all times and scores for ${selectedLocation || 'this location'}. Are you sure you want to continue?`
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

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

export const useGameTimer = (config: TimerConfig): UseGameTimerResult => {
  const [timerState, setTimerState] = useState<TimerState | null>(() => {
    const saved = localStorage.getItem('teamTimerState');
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
  const prevPhaseRef = useRef<string>(phase);
  const isLoadingScoresRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setGameResults(prev =>
      config.games.map((_, index) => prev[index] ?? { startTime: null, score: null })
    );
    setCurrentGameIndex(prev => Math.min(prev, Math.max(config.games.length - 1, 0)));
  }, [config.games.length]);

  useEffect(() => {
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
      localStorage.setItem('teamTimerState', JSON.stringify(newState));
    }
  }, [phase, timeRemaining, isRunning, isPaused, scores, currentGameIndex, gameResults]);

  useEffect(() => {
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
  }, [phase, currentGameIndex, scores]);

  useEffect(() => {
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
  }, [currentGameIndex, phase, gameResults.length]);

  useEffect(() => {
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
  }, [scores, phase, currentGameIndex]);

  useEffect(() => {
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
  }, [isRunning, isPaused]);

  const playBeep = (duration = 0.1, style: TimerToneStyle = 'beep'): void => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    playTimerTone(audioContextRef.current, duration, style);
  };

  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining <= 5 && timeRemaining > 0) {
      playBeep();
    }
  }, [timeRemaining, isRunning, isPaused]);

  useEffect(() => {
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
  }, [timeRemaining, phase, isRunning, isPaused, config, currentGameIndex]);

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

    setPhase('idle');
    setTimeRemaining(0);
    setIsRunning(false);
    setIsPaused(false);
    setScores({ team1: 0, team2: 0 });
    setCurrentGameIndex(0);
    setGameResults(createEmptyResults(config.games));
    setTimerState(null);
    localStorage.removeItem('teamTimerState');
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

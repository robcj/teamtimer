import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import './TimerDisplay.css';
import { TimerConfig, Scores, GameResult } from '../types';
import ScoreBoard from './ScoreBoard';
import GameNavigation from './GameNavigation';
import TimerHeader from './TimerHeader';
import TimerControls from './TimerControls';
import GameHeader from './GameHeader';

const PHASES = {
  COUNTDOWN: 'countdown',
  FIRST_HALF: 'firstHalf',
  HALF_TIME: 'halfTime',
  SECOND_HALF: 'secondHalf',
  BETWEEN_GAMES: 'betweenGames',
  IDLE: 'idle',
} as const;

type Phase = (typeof PHASES)[keyof typeof PHASES];

const PHASE_LABELS: Record<Phase, string> = {
  countdown: 'Countdown to Start',
  firstHalf: 'First Half',
  halfTime: 'Half Time',
  secondHalf: 'Second Half',
  betweenGames: 'Between Games',
  idle: 'Ready to Start',
};

interface TimerDisplayProps {
  config: TimerConfig;
  currentGameIndex: number;
  gameResults: GameResult[];
  onNextGame: () => void;
  onPrevGame: () => void;
  onResetGame: () => void;
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
  onResetTimer: () => void;
}

function TimerDisplay({
  config,
  currentGameIndex,
  gameResults,
  onNextGame,
  onPrevGame,
  onResetGame,
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
  onResetTimer,
}: TimerDisplayProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentGame = config.games[currentGameIndex];

  useEffect(() => {
    // Initialize AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const moveToNextPhase = (): void => {
    switch (phase) {
      case PHASES.COUNTDOWN:
        setPhase(PHASES.FIRST_HALF);
        setTimeRemaining(config.firstHalfDuration);
        break;
      case PHASES.FIRST_HALF:
        setPhase(PHASES.HALF_TIME);
        setTimeRemaining(config.halfTimeDuration);
        break;
      case PHASES.HALF_TIME:
        setPhase(PHASES.SECOND_HALF);
        setTimeRemaining(config.secondHalfDuration);
        break;
      case PHASES.SECOND_HALF:
        setPhase(PHASES.BETWEEN_GAMES);
        setTimeRemaining(config.betweenGamesDuration);
        break;
      case PHASES.BETWEEN_GAMES:
        setPhase(PHASES.IDLE);
        setIsRunning(false);
        setTimeRemaining(0);
        break;
      default:
        setPhase(PHASES.IDLE);
        setIsRunning(false);
        setTimeRemaining(0);
    }
  };

  const handleStart = (): void => {
    if (phase === PHASES.IDLE) {
      setPhase(PHASES.COUNTDOWN);
      setTimeRemaining(config.countdownToStart);
      setIsRunning(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsRunning(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    setIsPaused(true);
  };

  const handleSkipPhase = (): void => {
    moveToNextPhase();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextGameStartTime = (): string => {
    // Only show if timer is running and there's a next game
    if (!isRunning || isPaused || currentGameIndex >= config.games.length - 1) {
      return '';
    }
    // Calculate remaining time until next game starts
    let secondsUntilGameStart = timeRemaining;

    // Add time for remaining phases if not in idle
    if (phase === PHASES.COUNTDOWN) {
      secondsUntilGameStart +=
        config.firstHalfDuration +
        config.halfTimeDuration +
        config.secondHalfDuration +
        config.betweenGamesDuration;
    } else if (phase === PHASES.FIRST_HALF) {
      secondsUntilGameStart +=
        config.halfTimeDuration + config.secondHalfDuration + config.betweenGamesDuration;
    } else if (phase === PHASES.HALF_TIME) {
      secondsUntilGameStart += config.secondHalfDuration + config.betweenGamesDuration;
    } else if (phase === PHASES.SECOND_HALF) {
      secondsUntilGameStart += config.betweenGamesDuration;
    } else if (phase === PHASES.BETWEEN_GAMES) {
      // Next game starts after this phase
      secondsUntilGameStart = timeRemaining;
    } else {
      // Idle phase
      return '';
    }

    // Calculate the estimated time
    const now = new Date();
    const futureTime = new Date(now.getTime() + secondsUntilGameStart * 1000);

    // Format as HH:MM
    const hours = futureTime.getHours().toString().padStart(2, '0');
    const minutes = futureTime.getMinutes().toString().padStart(2, '0');
    const seconds = futureTime.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const incrementScore = (team: keyof Scores): void => {
    setScores(prev => ({
      ...prev,
      [team]: prev[team] + 1,
    }));
  };

  const decrementScore = (team: keyof Scores): void => {
    setScores(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] - 1),
    }));
  };

  const hasCompletedCurrentGame = Boolean(gameResults[currentGameIndex]?.score);
  const lastPlayedGameIndex =
    (phase === PHASES.BETWEEN_GAMES || phase === PHASES.IDLE) && hasCompletedCurrentGame
      ? currentGameIndex
      : currentGameIndex - 1;

  console.log('Current Game Index:', currentGameIndex);
  console.log('Game Results:', gameResults);
  console.log('Last Played Game Index:', lastPlayedGameIndex);

  return (
    <div className="timer-display">
      {currentGame && (
        <GameHeader
          game={currentGame}
          currentIndex={currentGameIndex}
          totalGames={config.games.length}
        />
      )}

      <TimerHeader
        phaseLabel={PHASE_LABELS[phase as Phase]}
        timeText={formatTime(timeRemaining)}
        isWarning={timeRemaining <= 5 && timeRemaining > 0}
      />

      {currentGame && (
        <ScoreBoard
          config={config}
          game={currentGame}
          scores={scores}
          onIncrement={incrementScore}
          onDecrement={decrementScore}
        />
      )}

      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={handleStart}
        onPause={handlePause}
        onReset={onResetTimer}
        onSkipPhase={handleSkipPhase}
        canSkip={phase !== PHASES.IDLE && isRunning}
      />

      <GameNavigation
        currentGameIndex={currentGameIndex}
        totalGames={config.games.length}
        onPrevGame={onPrevGame}
        onResetGame={onResetGame}
        onNextGame={onNextGame}
        nextGameStartTime={getNextGameStartTime()}
        previousGame={
          lastPlayedGameIndex >= 0
            ? {
                game: config.games[lastPlayedGameIndex],
                score: gameResults[lastPlayedGameIndex]?.score ?? null,
              }
            : null
        }
      />
    </div>
  );
}

export default TimerDisplay;

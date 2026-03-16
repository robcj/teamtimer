import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import './TimerDisplay.scss';
import {
  TimerConfig,
  Scores,
  GameResult,
  Location,
  PHASES,
  Phase,
  PHASE_LABELS,
  formatTimerDuration,
  resolveGamesFromResults,
  getTeamName,
} from '@team-timer/core';
import ScoreBoard from './ScoreBoard';
import TimerHeader from './TimerHeader';
import GameHeader from './GameHeader';
import GameSummary from './GameSummary';

interface TimerDisplayProps {
  config: TimerConfig;
  displayOnly?: boolean;
  showLocationSelector?: boolean;
  locations?: Location[];
  selectedLocation?: string;
  onSelectLocation?: (location: string) => void;
  onManualStart?: () => void;
  currentGameIndex: number;
  gameResults: GameResult[];
  phase: Phase;
  setPhase: Dispatch<SetStateAction<Phase>>;
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
  displayOnly = false,
  showLocationSelector = false,
  locations = [],
  selectedLocation = '',
  onSelectLocation,
  onManualStart,
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
  onResetTimer,
}: TimerDisplayProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseStartedAtRef = useRef<number | null>(null);
  const [pausedDurationSeconds, setPausedDurationSeconds] = useState<number>(0);

  const resolvedGames = resolveGamesFromResults(config.games, gameResults);
  const currentGame = resolvedGames[currentGameIndex];

  useEffect(() => {
    // Initialize AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning || !isPaused) {
      pauseStartedAtRef.current = null;
      setPausedDurationSeconds(0);
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
        pauseIntervalRef.current = null;
      }
      return;
    }

    const startedAt = Date.now();
    pauseStartedAtRef.current = startedAt;
    setPausedDurationSeconds(0);

    pauseIntervalRef.current = setInterval(() => {
      if (!pauseStartedAtRef.current) {
        return;
      }
      const elapsed = Math.floor((Date.now() - pauseStartedAtRef.current) / 1000);
      setPausedDurationSeconds(elapsed);
    }, 1000);

    return () => {
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
        pauseIntervalRef.current = null;
      }
    };
  }, [isRunning, isPaused]);

  const moveToNextPhase = (): void => {
    // The phase transition logic is handled in the useGameTimer hook, so we just need to set timeRemaining to 0 here to trigger it
    setTimeRemaining(0);
  };

  const handleStart = (): void => {
    if (phase === PHASES.IDLE) {
      onManualStart?.();
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

  const handleStartExtraTime = (): void => {
    setPhase(PHASES.EXTRA_TIME_COUNTDOWN);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleStartSuddenDeath = (): void => {
    setPhase(PHASES.SUDDEN_DEATH_COUNTDOWN);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handleEndSuddenDeath = (): void => {
    setTimeRemaining(0);
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
    phase === PHASES.BETWEEN_GAMES && hasCompletedCurrentGame
      ? currentGameIndex
      : currentGameIndex - 1;
  const nextGameIndex = phase === PHASES.IDLE ? currentGameIndex : currentGameIndex + 1;

  const previousGame =
    lastPlayedGameIndex >= 0
      ? {
          game: resolvedGames[lastPlayedGameIndex],
          score: gameResults[lastPlayedGameIndex]?.score ?? null,
        }
      : null;
  const nextGame =
    nextGameIndex >= 0 && nextGameIndex < resolvedGames.length
      ? {
          game: resolvedGames[nextGameIndex],
          team1Name: getTeamName(config.teams, resolvedGames[nextGameIndex].team1),
          team2Name: getTeamName(config.teams, resolvedGames[nextGameIndex].team2),
        }
      : null;

  const previousGameSummary = previousGame && {
    game: previousGame.game,
    score: previousGame.score,
    team1Name: getTeamName(config.teams, previousGame.game.team1),
    team2Name: getTeamName(config.teams, previousGame.game.team2),
  };

  const gameHeaderControlProps = !displayOnly
    ? {
        isRunning,
        isPaused,
        phase,
        onStart: handleStart,
        onPause: handlePause,
        onStartExtraTime: handleStartExtraTime,
        onStartSuddenDeath: handleStartSuddenDeath,
        onEndSuddenDeath: handleEndSuddenDeath,
        onReset: onResetTimer,
        onSkipPhase: handleSkipPhase,
        canSkip: phase !== PHASES.IDLE && isRunning,
      }
    : {};

  return (
    <div className="timer-display">
      {(!displayOnly || currentGame) && (
        <GameHeader
          currentIndex={currentGameIndex}
          totalGames={config.games.length}
          scores={scores}
          showLocationSelector={showLocationSelector && Boolean(currentGame)}
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
          {...gameHeaderControlProps}
        />
      )}

      <TimerHeader
        phaseLabel={PHASE_LABELS[phase as Phase]}
        timeText={phase === PHASES.SUDDEN_DEATH ? ' - : - ' : formatTimerDuration(timeRemaining)}
        isWarning={timeRemaining <= 5 && timeRemaining > 0}
        isPaused={isPaused}
        pausedDurationText={formatTimerDuration(pausedDurationSeconds)}
      />

      {currentGame && (
        <ScoreBoard
          config={config}
          game={currentGame}
          scores={scores}
          readOnly={displayOnly}
          onIncrement={incrementScore}
          onDecrement={decrementScore}
        />
      )}

      <GameSummary previousGame={previousGameSummary} nextGame={nextGame} />
    </div>
  );
}

export default TimerDisplay;

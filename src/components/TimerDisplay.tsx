import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import './TimerDisplay.scss';
import { TimerConfig, Scores, GameResult, Location } from '../types';
import ScoreBoard from './ScoreBoard';
import TimerHeader from './TimerHeader';
import TimerControls from './TimerControls';
import GameHeader from './GameHeader';
import { PHASES, Phase, PHASE_LABELS } from '../utils/phases';
import { formatTimerDuration } from '../utils/timerDisplay';
import { resolveGamesFromResults } from '../utils/gameSetupResolution';
import { getTeamName } from '../utils/teams';

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
  const nextGameIndex = lastPlayedGameIndex + 1;
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

  return (
    <div className="timer-display">
      {currentGame && (
        <GameHeader
          currentIndex={currentGameIndex}
          totalGames={config.games.length}
          showLocationSelector={showLocationSelector}
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={onSelectLocation}
        />
      )}

      <TimerHeader
        phaseLabel={PHASE_LABELS[phase as Phase]}
        timeText={formatTimerDuration(timeRemaining)}
        isWarning={timeRemaining <= 5 && timeRemaining > 0}
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

      {!displayOnly && (
        <>
          <TimerControls
            isRunning={isRunning}
            isPaused={isPaused}
            previousGame={previousGameSummary}
            nextGame={nextGame}
            onStart={handleStart}
            onPause={handlePause}
            onReset={onResetTimer}
            onSkipPhase={handleSkipPhase}
            canSkip={phase !== PHASES.IDLE && isRunning}
          />
        </>
      )}
    </div>
  );
}

export default TimerDisplay;

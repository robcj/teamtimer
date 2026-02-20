import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import './TimerDisplay.css';
import { TimerConfig, Scores, GameResult } from '../types';

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
  onNextGame: () => void;
  onPrevGame: () => void;
  onResetGame: () => void;
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
  currentGameIndex,
  onNextGame,
  onPrevGame,
  onResetGame,
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
  const [isScoresOpen, setIsScoresOpen] = useState<boolean>(false);

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

  return (
    <div className="timer-display">
      {currentGame && (
        <div className="game-info">
          <h2>
            Game {currentGameIndex + 1} of {config.games.length}
          </h2>
        </div>
      )}

      <div className="timer-container">
        <div className="phase-label">{PHASE_LABELS[phase as Phase]}</div>
        <div className={`timer ${timeRemaining <= 5 && timeRemaining > 0 ? 'warning' : ''}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {currentGame && (
        <div className="score-display">
          <div className="score-team left-team">
            <div className="team-color-label">{config.leftTeamLabel}</div>
            <div className="team-name">{currentGame.team1}</div>
            <div className="score-row">
              <button onClick={() => decrementScore('team1')} className="score-btn minus">
                -
              </button>
              <div className="score-value">{scores.team1}</div>
              <button onClick={() => incrementScore('team1')} className="score-btn plus">
                +
              </button>
            </div>
          </div>

          <div className="score-team right-team">
            <div className="team-color-label">{config.rightTeamLabel}</div>
            <div className="team-name">{currentGame.team2}</div>
            <div className="score-row">
              <button onClick={() => decrementScore('team2')} className="score-btn minus">
                -
              </button>
              <div className="score-value">{scores.team2}</div>
              <button onClick={() => incrementScore('team2')} className="score-btn plus">
                +
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="controls">
        <button
          onClick={handleStart}
          disabled={isRunning && !isPaused}
          className="control-btn start-btn"
        >
          {isPaused ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning || isPaused}
          className="control-btn pause-btn"
        >
          Pause
        </button>
        <button onClick={onResetTimer} className="control-btn reset-btn">
          Reset
        </button>
        <button onClick={() => setIsScoresOpen(true)} className="control-btn scores-btn">
          Game Scores
        </button>
        <button
          onClick={handleSkipPhase}
          disabled={phase === PHASES.IDLE || !isRunning}
          className="control-btn skip-btn"
        >
          Skip Phase
        </button>
      </div>

      {config.games.length > 0 && (
        <div className="game-navigation">
          <button onClick={onPrevGame} disabled={currentGameIndex === 0} className="nav-btn">
            Previous Game
          </button>
          <button onClick={onResetGame} className="nav-btn">
            First Game
          </button>
          <button
            onClick={onNextGame}
            disabled={currentGameIndex >= config.games.length - 1}
            className="nav-btn"
          >
            Next Game
          </button>{' '}
          {getNextGameStartTime() && (
            <div className="next-game-time">Next game starts at: {getNextGameStartTime()}</div>
          )}
        </div>
      )}

      {isScoresOpen && (
        <div className="scores-dialog-backdrop" onClick={() => setIsScoresOpen(false)}>
          <div className="scores-dialog" onClick={event => event.stopPropagation()}>
            <div className="scores-dialog-header">
              <h3>Game Scores</h3>
              <button
                className="scores-dialog-close"
                onClick={() => setIsScoresOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="scores-dialog-body">
              {config.games.length === 0 ? (
                <div className="scores-empty">No games configured.</div>
              ) : (
                <div className="scores-list">
                  {config.games.map((game, index) => {
                    const result = gameResults[index];
                    const startTime = result?.startTime ?? '—';
                    const hasScore = Boolean(result?.score);
                    const team1Score = result?.score?.team1 ?? 0;
                    const team2Score = result?.score?.team2 ?? 0;
                    const team1Wins = hasScore && team1Score > team2Score;
                    const team2Wins = hasScore && team2Score > team1Score;
                    const scoreText = result?.score
                      ? `${result.score.team1} - ${result.score.team2}`
                      : '—';
                    return (
                      <div className="scores-row" key={`${game.team1}-${game.team2}-${index}`}>
                        <div className="scores-title">
                          Game {index + 1}:{' '}
                          <span className={team1Wins ? 'scores-winner' : undefined}>
                            {game.team1}
                          </span>{' '}
                          vs{' '}
                          <span className={team2Wins ? 'scores-winner' : undefined}>
                            {game.team2}
                          </span>
                        </div>
                        <div className="scores-meta">
                          <span className="scores-start">Start: {startTime}</span>
                          <span className="scores-score">Score: {scoreText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerDisplay;

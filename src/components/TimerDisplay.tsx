import React, { useState, useEffect, useRef } from 'react';
import './TimerDisplay.css';
import { TimerConfig, Scores } from '../types';

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
}

function TimerDisplay({
  config,
  currentGameIndex,
  onNextGame,
  onPrevGame,
  onResetGame,
}: TimerDisplayProps) {
  const [phase, setPhase] = useState<Phase>(PHASES.IDLE);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scores, setScores] = useState<Scores>({ team1: 0, team2: 0 });
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

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;

          // Beep for last 5 seconds
          if (newTime <= 5 && newTime > 0) {
            playBeep();
          }

          // When timer reaches 0, move to next phase
          if (newTime <= 0) {
            playBeep();
            moveToNextPhase();
            return 0;
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, phase]);

  const playBeep = (): void => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.1);
  };

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

  const handleReset = (): void => {
    setPhase(PHASES.IDLE);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setScores({ team1: 0, team2: 0 });
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
        <div className="phase-label">{PHASE_LABELS[phase]}</div>
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
        <button onClick={handleReset} className="control-btn reset-btn">
          Reset
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
          </button>
        </div>
      )}
    </div>
  );
}

export default TimerDisplay;

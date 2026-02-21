import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import TimerDisplay from './components/TimerDisplay';
import Configuration from './components/Configuration';
import GameScoresDialog from './components/GameScoresDialog';
import { TimerConfig, ViewType, TimerState, Scores, Game, GameResult } from './types';

const DEFAULT_CONFIG: TimerConfig = {
  countdownToStart: 20,
  firstHalfDuration: 600, // 10 minutes in seconds
  halfTimeDuration: 120, // 2 minutes
  secondHalfDuration: 600, // 10 minutes
  betweenGamesDuration: 180, // 3 minutes
  games: [],
  leftTeamLabel: 'White',
  rightTeamLabel: 'Black',
  competitionName: '',
};

function App() {
  const [view, setView] = useState<ViewType>('timer');
  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem('teamTimerConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [timerState, setTimerState] = useState<TimerState | null>(() => {
    const saved = localStorage.getItem('teamTimerState');
    return saved ? JSON.parse(saved) : null;
  });

  const formatClockTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const createEmptyResults = (games: Game[]): GameResult[] =>
    games.map(() => ({ startTime: null, score: null }));

  const [currentGameIndex, setCurrentGameIndex] = useState<number>(
    () => timerState?.currentGameIndex ?? 0
  );
  const [isScoresOpen, setIsScoresOpen] = useState<boolean>(false);

  // Expanded state for active timer management
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

  useEffect(() => {
    localStorage.setItem('teamTimerConfig', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    setGameResults(prev =>
      config.games.map((_, index) => prev[index] ?? { startTime: null, score: null })
    );
    setCurrentGameIndex(prev => Math.min(prev, Math.max(config.games.length - 1, 0)));
  }, [config.games.length]);

  // Save timer state whenever it changes
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

  const prevPhaseRef = useRef<string>(phase);
  const isLoadingScoresRef = useRef<boolean>(false);

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

  // Load scores for the current game when navigating between games
  useEffect(() => {
    if (phase === 'idle' || phase === 'betweenGames') {
      isLoadingScoresRef.current = true;
      const currentGameResult = gameResults[currentGameIndex];
      if (currentGameResult?.score) {
        // Game has been played - load its scores
        setScores(currentGameResult.score);
      } else {
        // Game hasn't been played yet - reset scores
        setScores({ team1: 0, team2: 0 });
      }
      // Use a timeout to reset the flag after state updates have processed
      setTimeout(() => {
        isLoadingScoresRef.current = false;
      }, 0);
    }
  }, [currentGameIndex, phase, gameResults.length]);

  // Save score changes back to gameResults when not actively timing
  useEffect(() => {
    if (
      !isLoadingScoresRef.current &&
      (phase === 'idle' || phase === 'betweenGames') &&
      currentGameIndex >= 0
    ) {
      setGameResults(prev => {
        const next = [...prev];
        const current = next[currentGameIndex] ?? { startTime: null, score: null };
        // Only update if scores have changed or if there were no scores before
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

  // Main timer interval - runs regardless of view
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
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = (): void => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
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

  // Beep for last 5 seconds
  useEffect(() => {
    if (isRunning && !isPaused && timeRemaining <= 5 && timeRemaining > 0) {
      playBeep();
    }
  }, [timeRemaining, isRunning, isPaused]);

  // Handle phase transitions when time reaches 0
  useEffect(() => {
    if (timeRemaining === 0 && isRunning && !isPaused && phase !== 'idle') {
      playBeep();

      // Perform phase transition
      switch (phase) {
        case 'countdown':
          setPhase('firstHalf');
          setTimeRemaining(config.firstHalfDuration);
          // Keep running - first half should start automatically after countdown
          break;
        case 'firstHalf':
          setPhase('halfTime');
          setTimeRemaining(config.halfTimeDuration);
          // Keep running - half time should start automatically
          break;
        case 'halfTime':
          setPhase('secondHalf');
          setTimeRemaining(config.secondHalfDuration);
          // Keep running - second half should start automatically
          break;
        case 'secondHalf':
          setPhase('betweenGames');
          setTimeRemaining(config.betweenGamesDuration);
          // Keep running - between games timer should start automatically
          break;
        case 'betweenGames':
          // Check if there's another game to play
          if (currentGameIndex < config.games.length - 1) {
            // Move to next game and start first half immediately
            setCurrentGameIndex(currentGameIndex + 1);
            setScores({ team1: 0, team2: 0 });
            setPhase('firstHalf');
            setTimeRemaining(config.firstHalfDuration);
            // Keep running - next game starts without a countdown
          } else {
            // No more games, go to idle
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

  const handleConfigSave = (newConfig: TimerConfig): void => {
    setConfig(newConfig);
    setView('timer');
  };

  const handleConfigCancel = (): void => {
    setView('timer');
  };

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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <h1>Team Timer</h1>
        </div>
        {config.competitionName && <p className="competition-name">{config.competitionName}</p>}
        <div className="header-buttons">
          {view === 'timer' && (
            <button
              onClick={() => setIsScoresOpen(true)}
              className="config-button scores-header-button"
            >
              Game Scores
            </button>
          )}
          {view === 'timer' && (
            <button onClick={() => setView('config')} className="config-button">
              Configuration
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {view === 'timer' ? (
          <TimerDisplay
            config={config}
            currentGameIndex={currentGameIndex}
            gameResults={gameResults}
            onNextGame={handleNextGame}
            onPrevGame={handlePrevGame}
            onResetGame={handleResetGame}
            phase={phase}
            setPhase={setPhase}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            scores={scores}
            setScores={setScores}
            onResetTimer={handleResetTimer}
          />
        ) : (
          <Configuration config={config} onSave={handleConfigSave} onCancel={handleConfigCancel} />
        )}
      </main>
      <GameScoresDialog
        isOpen={isScoresOpen}
        games={config.games}
        results={gameResults}
        leftTeamLabel={config.leftTeamLabel}
        rightTeamLabel={config.rightTeamLabel}
        competitionName={config.competitionName || ''}
        onClose={() => setIsScoresOpen(false)}
      />
    </div>
  );
}

export default App;

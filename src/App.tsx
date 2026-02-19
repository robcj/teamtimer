import React, { useState, useEffect } from 'react';
import './App.css';
import TimerDisplay from './components/TimerDisplay';
import Configuration from './components/Configuration';
import { TimerConfig, ViewType } from './types';

const DEFAULT_CONFIG: TimerConfig = {
  countdownToStart: 20,
  firstHalfDuration: 600, // 10 minutes in seconds
  halfTimeDuration: 120, // 2 minutes
  secondHalfDuration: 600, // 10 minutes
  betweenGamesDuration: 180, // 3 minutes
  games: [],
  leftTeamLabel: 'White',
  rightTeamLabel: 'Black',
};

function App() {
  const [view, setView] = useState<ViewType>('timer');
  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem('teamTimerConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [currentGameIndex, setCurrentGameIndex] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('teamTimerConfig', JSON.stringify(config));
  }, [config]);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Team Timer</h1>
        <div className="header-buttons">
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
            onNextGame={handleNextGame}
            onPrevGame={handlePrevGame}
            onResetGame={handleResetGame}
          />
        ) : (
          <Configuration config={config} onSave={handleConfigSave} onCancel={handleConfigCancel} />
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.scss';
import TimerDisplay from './components/TimerDisplay';
import Configuration from './components/Configuration';
import GameScoresView from './components/GameScoresView';
import AppHeader from './components/AppHeader';
import Draw from './components/Draw';
import { TimerConfig, ViewType } from './types';
import { useGameTimer } from './hooks/useGameTimer';
import { useWakeLock } from './hooks/useWakeLock';

import { normalizeTeams } from './utils/teams';
const DEFAULT_CONFIG: TimerConfig = {
  countdownToStart: 20,
  firstHalfDuration: 600, // 10 minutes in seconds
  halfTimeDuration: 120, // 2 minutes
  secondHalfDuration: 600, // 10 minutes
  betweenGamesDuration: 180, // 3 minutes
  keepScreenAwake: true,
  divisions: [],
  teams: [],
  games: [],
  leftTeamLabel: 'White',
  rightTeamLabel: 'Black',
  competitionName: '',
};

function App() {
  const isDisplayOnly = new URLSearchParams(window.location.search).get('view') === 'display';
  const [view, setView] = useState<ViewType>('timer');
  const [config, setConfig] = useState<TimerConfig>(() => {
    const saved = localStorage.getItem('teamTimerConfig');
    if (!saved) {
      return DEFAULT_CONFIG;
    }
    const parsed = JSON.parse(saved) as Partial<TimerConfig>;
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      keepScreenAwake: parsed.keepScreenAwake ?? DEFAULT_CONFIG.keepScreenAwake,
      divisions: parsed.divisions || [],
      teams: normalizeTeams(parsed.teams),
      games: parsed.games || [],
    };
  });

  useWakeLock(config.keepScreenAwake);

  const {
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
  } = useGameTimer(config, { readOnlyMirror: isDisplayOnly });

  useEffect(() => {
    if (isDisplayOnly) {
      return;
    }
    localStorage.setItem('teamTimerConfig', JSON.stringify(config));
  }, [config, isDisplayOnly]);

  useEffect(() => {
    if (!isDisplayOnly) {
      return;
    }

    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== 'teamTimerConfig' || !event.newValue) {
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as Partial<TimerConfig>;
        setConfig({
          ...DEFAULT_CONFIG,
          ...parsed,
          keepScreenAwake: parsed.keepScreenAwake ?? DEFAULT_CONFIG.keepScreenAwake,
          divisions: parsed.divisions || [],
          teams: normalizeTeams(parsed.teams),
          games: parsed.games || [],
        });
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [isDisplayOnly]);

  const handleConfigSave = (newConfig: TimerConfig): void => {
    setConfig(newConfig);
    setView('timer');
  };

  const handleConfigCancel = (): void => {
    setView('timer');
  };

  const handleDrawSave = (newConfig: TimerConfig): void => {
    setConfig(newConfig);
    setView('timer');
  };

  const handleDrawCancel = (): void => {
    setView('timer');
  };

  const handleOpenSecondScreen = (): void => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'display');
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="app">
      {!isDisplayOnly && (
        <AppHeader
          view={view}
          competitionName={config.competitionName}
          onOpenScores={() => setView('scores')}
          onOpenDraw={() => setView('draw')}
          onOpenConfig={() => setView('config')}
          onViewTimer={() => setView('timer')}
          onOpenSecondScreen={handleOpenSecondScreen}
        />
      )}

      <main className="app-main">
        {view === 'timer' || isDisplayOnly ? (
          <TimerDisplay
            config={config}
            displayOnly={isDisplayOnly}
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
        ) : view === 'draw' ? (
          <Draw
            config={config}
            gameResults={gameResults}
            onSave={handleDrawSave}
            onCancel={handleDrawCancel}
          />
        ) : view === 'scores' ? (
          <GameScoresView
            games={config.games}
            teams={config.teams}
            results={gameResults}
            leftTeamLabel={config.leftTeamLabel}
            rightTeamLabel={config.rightTeamLabel}
            competitionName={config.competitionName || ''}
          />
        ) : (
          <Configuration config={config} onSave={handleConfigSave} onCancel={handleConfigCancel} />
        )}
      </main>
    </div>
  );
}

export default App;

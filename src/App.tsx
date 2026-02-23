import React, { useState, useEffect } from 'react';
import './App.scss';
import TimerDisplay from './components/TimerDisplay';
import Configuration from './components/Configuration';
import GameScoresView from './components/GameScoresView';
import AppHeader from './components/AppHeader';
import Draw from './components/Draw';
import LocationTimerPanel, {
  getLocationGameResultsSnapshot,
} from './components/LocationTimerPanel';
import { TimerConfig, ViewType } from './types';
import { useWakeLock } from './hooks/useWakeLock';

import { normalizeTeams } from './utils/teams';
const DEFAULT_CONFIG: TimerConfig = {
  countdownToStart: 20,
  firstHalfDuration: 600, // 10 minutes in seconds
  halfTimeDuration: 120, // 2 minutes
  secondHalfDuration: 600, // 10 minutes
  betweenGamesDuration: 180, // 3 minutes
  keepScreenAwake: true,
  locations: [],
  divisions: [],
  teams: [],
  games: [],
  leftTeamLabel: 'White',
  rightTeamLabel: 'Black',
  tournamentStartAt: '',
  competitionName: '',
};

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isDisplayOnly = urlParams.get('view') === 'display';
  const initialLayoutParam = urlParams.get('layout');
  const initialLocationParam = urlParams.get('location');
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
      locations: parsed.locations || [],
      divisions: parsed.divisions || [],
      teams: normalizeTeams(parsed.teams),
      games: parsed.games || [],
      tournamentStartAt: parsed.tournamentStartAt || '',
    };
  });
  const [timerLayout, setTimerLayout] = useState<'single' | 'split'>(
    initialLayoutParam === 'split' ? 'split' : 'single'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocationParam || '');

  useWakeLock(config.keepScreenAwake);

  const locations = config.locations.length > 0 ? config.locations : ['Location 1'];
  const defaultLocation = locations[0];

  const getGameLocation = (gameLocation?: string): string => {
    if (gameLocation && locations.includes(gameLocation)) {
      return gameLocation;
    }
    return defaultLocation;
  };

  useEffect(() => {
    if (!selectedLocation || !locations.includes(selectedLocation)) {
      setSelectedLocation(defaultLocation);
    }
    if (locations.length <= 1 && timerLayout === 'split') {
      setTimerLayout('single');
    }
  }, [locations, selectedLocation, defaultLocation, timerLayout]);

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
          locations: parsed.locations || [],
          divisions: parsed.divisions || [],
          teams: normalizeTeams(parsed.teams),
          games: parsed.games || [],
          tournamentStartAt: parsed.tournamentStartAt || '',
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

    if (locations.length > 1) {
      const optionsText = locations
        .map((location, index) => `${index + 1}. ${location}`)
        .join('\n');
      const choice = window.prompt(
        `Open second screen for which location?\n\n${optionsText}\n\nType a number, or type "all" for split screen.`,
        selectedLocation ? String(locations.indexOf(selectedLocation) + 1) : '1'
      );

      if (!choice) {
        return;
      }

      if (choice.trim().toLowerCase() === 'all') {
        url.searchParams.set('layout', 'split');
        url.searchParams.delete('location');
      } else {
        const indexChoice = Number(choice.trim());
        const locationChoice = Number.isInteger(indexChoice)
          ? locations[indexChoice - 1]
          : locations.find(location => location.toLowerCase() === choice.trim().toLowerCase());

        if (!locationChoice) {
          alert('Invalid location choice.');
          return;
        }

        url.searchParams.set('layout', 'single');
        url.searchParams.set('location', locationChoice);
      }
    } else {
      url.searchParams.set('layout', 'single');
      url.searchParams.set('location', locations[0]);
    }

    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  const gameResults = getLocationGameResultsSnapshot(config.games, locations);
  const isSplitView = timerLayout === 'split' && locations.length > 1;

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
          <>
            {locations.length > 1 && (
              <div className="location-view-controls">
                <label>
                  Location:
                  <select
                    value={selectedLocation}
                    onChange={event => setSelectedLocation(event.target.value)}
                  >
                    {locations.map(location => (
                      <option key={`view-location-${location}`} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="location-layout-buttons">
                  <button
                    className={`config-button ${!isSplitView ? 'active-layout' : ''}`}
                    onClick={() => setTimerLayout('single')}
                  >
                    Single
                  </button>
                  <button
                    className={`config-button ${isSplitView ? 'active-layout' : ''}`}
                    onClick={() => setTimerLayout('split')}
                  >
                    Split
                  </button>
                </div>
              </div>
            )}

            <div className={`location-timer-grid ${isSplitView ? 'split' : 'single'}`}>
              {locations.map(location => {
                const locationGames = config.games.filter(
                  game => getGameLocation(game.location) === location
                );

                return (
                  <LocationTimerPanel
                    key={location}
                    location={location}
                    config={config}
                    games={locationGames}
                    readOnlyMirror={isDisplayOnly}
                    displayOnly={isDisplayOnly}
                    hidden={!isSplitView && selectedLocation !== location}
                  />
                );
              })}
            </div>
          </>
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

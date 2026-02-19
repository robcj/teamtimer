import React, { useState, ChangeEvent } from 'react';
import './Configuration.css';
import { TimerConfig, Game } from '../types';

interface ConfigurationProps {
  config: TimerConfig;
  onSave: (config: TimerConfig) => void;
  onCancel: () => void;
}

function Configuration({ config, onSave, onCancel }: ConfigurationProps) {
  const [countdownToStart, setCountdownToStart] = useState<number>(config.countdownToStart);
  const [firstHalfDuration, setFirstHalfDuration] = useState<number>(config.firstHalfDuration);
  const [halfTimeDuration, setHalfTimeDuration] = useState<number>(config.halfTimeDuration);
  const [secondHalfDuration, setSecondHalfDuration] = useState<number>(config.secondHalfDuration);
  const [betweenGamesDuration, setBetweenGamesDuration] = useState<number>(
    config.betweenGamesDuration
  );
  const [leftTeamLabel, setLeftTeamLabel] = useState<string>(config.leftTeamLabel || 'White');
  const [rightTeamLabel, setRightTeamLabel] = useState<string>(config.rightTeamLabel || 'Black');
  const [games, setGames] = useState<Game[]>(config.games || []);
  const [newTeam1, setNewTeam1] = useState<string>('');
  const [newTeam2, setNewTeam2] = useState<string>('');

  const handleSave = (): void => {
    const newConfig: TimerConfig = {
      countdownToStart: parseInt(countdownToStart.toString()),
      firstHalfDuration: parseInt(firstHalfDuration.toString()),
      halfTimeDuration: parseInt(halfTimeDuration.toString()),
      secondHalfDuration: parseInt(secondHalfDuration.toString()),
      betweenGamesDuration: parseInt(betweenGamesDuration.toString()),
      leftTeamLabel: leftTeamLabel.trim() || 'White',
      rightTeamLabel: rightTeamLabel.trim() || 'Black',
      games,
    };
    onSave(newConfig);
  };

  const handleAddGame = (): void => {
    if (newTeam1.trim() && newTeam2.trim()) {
      setGames([...games, { team1: newTeam1.trim(), team2: newTeam2.trim() }]);
      setNewTeam1('');
      setNewTeam2('');
    }
  };

  const handleRemoveGame = (index: number): void => {
    setGames(games.filter((_, i) => i !== index));
  };

  const handleMoveGameUp = (index: number): void => {
    if (index > 0) {
      const newGames = [...games];
      [newGames[index - 1], newGames[index]] = [newGames[index], newGames[index - 1]];
      setGames(newGames);
    }
  };

  const handleMoveGameDown = (index: number): void => {
    if (index < games.length - 1) {
      const newGames = [...games];
      [newGames[index], newGames[index + 1]] = [newGames[index + 1], newGames[index]];
      setGames(newGames);
    }
  };

  const handleExportConfig = (): void => {
    const configToExport: TimerConfig = {
      countdownToStart: parseInt(countdownToStart.toString()),
      firstHalfDuration: parseInt(firstHalfDuration.toString()),
      halfTimeDuration: parseInt(halfTimeDuration.toString()),
      secondHalfDuration: parseInt(secondHalfDuration.toString()),
      betweenGamesDuration: parseInt(betweenGamesDuration.toString()),
      leftTeamLabel: leftTeamLabel.trim() || 'White',
      rightTeamLabel: rightTeamLabel.trim() || 'Black',
      games,
    };

    const dataStr = JSON.stringify(configToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-timer-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const importedConfig: TimerConfig = JSON.parse(result);
            setCountdownToStart(importedConfig.countdownToStart || 20);
            setFirstHalfDuration(importedConfig.firstHalfDuration || 600);
            setHalfTimeDuration(importedConfig.halfTimeDuration || 120);
            setSecondHalfDuration(importedConfig.secondHalfDuration || 600);
            setBetweenGamesDuration(importedConfig.betweenGamesDuration || 180);
            setLeftTeamLabel(importedConfig.leftTeamLabel || 'White');
            setRightTeamLabel(importedConfig.rightTeamLabel || 'Black');
            setGames(importedConfig.games || []);
          }
        } catch (error) {
          alert('Error importing configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const secondsToMinutes = (seconds: number): string => {
    return (seconds / 60).toFixed(2);
  };

  const minutesToSeconds = (minutes: string): number => {
    return Math.round(parseFloat(minutes) * 60);
  };

  return (
    <div className="configuration">
      <h2>Configuration</h2>

      <div className="config-section">
        <h3>Timer Durations</h3>
        <div className="config-group">
          <label>
            Countdown to Start (seconds):
            <input
              type="number"
              value={countdownToStart}
              onChange={e => setCountdownToStart(Number(e.target.value))}
              min="0"
            />
          </label>

          <label>
            First Half Duration (minutes):
            <input
              type="number"
              step="0.1"
              value={secondsToMinutes(firstHalfDuration)}
              onChange={e => setFirstHalfDuration(minutesToSeconds(e.target.value))}
              min="0"
            />
          </label>

          <label>
            Half Time Duration (minutes):
            <input
              type="number"
              step="0.1"
              value={secondsToMinutes(halfTimeDuration)}
              onChange={e => setHalfTimeDuration(minutesToSeconds(e.target.value))}
              min="0"
            />
          </label>

          <label>
            Second Half Duration (minutes):
            <input
              type="number"
              step="0.1"
              value={secondsToMinutes(secondHalfDuration)}
              onChange={e => setSecondHalfDuration(minutesToSeconds(e.target.value))}
              min="0"
            />
          </label>

          <label>
            Between Games Duration (minutes):
            <input
              type="number"
              step="0.1"
              value={secondsToMinutes(betweenGamesDuration)}
              onChange={e => setBetweenGamesDuration(minutesToSeconds(e.target.value))}
              min="0"
            />
          </label>
        </div>
      </div>

      <div className="config-section">
        <h3>Team Colour Labels</h3>
        <div className="config-group">
          <label>
            Left Team Label:
            <input
              type="text"
              value={leftTeamLabel}
              onChange={e => setLeftTeamLabel(e.target.value)}
              placeholder="White"
            />
          </label>

          <label>
            Right Team Label:
            <input
              type="text"
              value={rightTeamLabel}
              onChange={e => setRightTeamLabel(e.target.value)}
              placeholder="Black"
            />
          </label>
        </div>
      </div>

      <div className="config-section">
        <h3>Game Draw</h3>
        <div className="add-game">
          <input
            type="text"
            placeholder="Team 1"
            value={newTeam1}
            onChange={e => setNewTeam1(e.target.value)}
          />
          <span className="vs-label">vs</span>
          <input
            type="text"
            placeholder="Team 2"
            value={newTeam2}
            onChange={e => setNewTeam2(e.target.value)}
          />
          <button onClick={handleAddGame} className="add-btn">
            Add Game
          </button>
        </div>

        <div className="games-list">
          {games.map((game, index) => (
            <div key={index} className="game-item">
              <span className="game-number">Game {index + 1}:</span>
              <span className="game-teams">
                {game.team1} vs {game.team2}
              </span>
              <div className="game-controls">
                <button
                  onClick={() => handleMoveGameUp(index)}
                  disabled={index === 0}
                  className="move-btn"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveGameDown(index)}
                  disabled={index === games.length - 1}
                  className="move-btn"
                >
                  ↓
                </button>
                <button onClick={() => handleRemoveGame(index)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="config-section">
        <h3>Import / Export</h3>
        <div className="import-export">
          <button onClick={handleExportConfig} className="export-btn">
            Export Configuration
          </button>
          <label className="import-btn">
            Import Configuration
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="config-actions">
        <button onClick={handleSave} className="save-btn">
          Save
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Configuration;

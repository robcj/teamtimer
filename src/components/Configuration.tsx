import React, { useState, ChangeEvent } from 'react';
import './Configuration.css';
import { Team, TimerConfig } from '../types';
import { normalizeTeams } from '../utils/teams';

interface ConfigurationProps {
  config: TimerConfig;
  onSave: (config: TimerConfig) => void;
  onCancel: () => void;
}

function Configuration({ config, onSave, onCancel }: ConfigurationProps) {
  const [competitionName, setCompetitionName] = useState<string>(config.competitionName || '');
  const [countdownToStart, setCountdownToStart] = useState<number>(config.countdownToStart);
  const [firstHalfDuration, setFirstHalfDuration] = useState<number>(config.firstHalfDuration);
  const [halfTimeDuration, setHalfTimeDuration] = useState<number>(config.halfTimeDuration);
  const [secondHalfDuration, setSecondHalfDuration] = useState<number>(config.secondHalfDuration);
  const [betweenGamesDuration, setBetweenGamesDuration] = useState<number>(
    config.betweenGamesDuration
  );
  const [divisions, setDivisions] = useState<string[]>(config.divisions || []);
  const [leftTeamLabel, setLeftTeamLabel] = useState<string>(config.leftTeamLabel || 'White');
  const [rightTeamLabel, setRightTeamLabel] = useState<string>(config.rightTeamLabel || 'Black');
  const [teams, setTeams] = useState<Team[]>(normalizeTeams(config.teams));

  const handleSave = (): void => {
    const newConfig: TimerConfig = {
      countdownToStart: parseInt(countdownToStart.toString()),
      firstHalfDuration: parseInt(firstHalfDuration.toString()),
      halfTimeDuration: parseInt(halfTimeDuration.toString()),
      secondHalfDuration: parseInt(secondHalfDuration.toString()),
      betweenGamesDuration: parseInt(betweenGamesDuration.toString()),
      divisions,
      teams,
      leftTeamLabel: leftTeamLabel.trim() || 'White',
      rightTeamLabel: rightTeamLabel.trim() || 'Black',
      competitionName: competitionName.trim(),
      games: config.games,
    };
    onSave(newConfig);
  };

  const handleExportConfig = (): void => {
    const configToExport: TimerConfig = {
      countdownToStart: parseInt(countdownToStart.toString()),
      firstHalfDuration: parseInt(firstHalfDuration.toString()),
      halfTimeDuration: parseInt(halfTimeDuration.toString()),
      secondHalfDuration: parseInt(secondHalfDuration.toString()),
      betweenGamesDuration: parseInt(betweenGamesDuration.toString()),
      divisions,
      teams,
      leftTeamLabel: leftTeamLabel.trim() || 'White',
      rightTeamLabel: rightTeamLabel.trim() || 'Black',
      competitionName: competitionName.trim(),
      games: config.games,
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
            setCompetitionName(importedConfig.competitionName || '');
            setCountdownToStart(importedConfig.countdownToStart || 20);
            setFirstHalfDuration(importedConfig.firstHalfDuration || 600);
            setHalfTimeDuration(importedConfig.halfTimeDuration || 120);
            setSecondHalfDuration(importedConfig.secondHalfDuration || 600);
            setBetweenGamesDuration(importedConfig.betweenGamesDuration || 180);
            setDivisions(importedConfig.divisions || []);
            setTeams(normalizeTeams(importedConfig.teams));
            setLeftTeamLabel(importedConfig.leftTeamLabel || 'White');
            setRightTeamLabel(importedConfig.rightTeamLabel || 'Black');
          }
        } catch (error) {
          alert('Error importing configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const secondsToMinutesAndSeconds = (
    totalSeconds: number
  ): { minutes: number; seconds: number } => {
    return {
      minutes: Math.floor(totalSeconds / 60),
      seconds: totalSeconds % 60,
    };
  };

  const minutesAndSecondsToSeconds = (minutes: number, seconds: number): number => {
    return minutes * 60 + seconds;
  };

  return (
    <div className="configuration">
      <h2>Configuration</h2>

      <div className="config-section">
        <h3>Competition</h3>
        <div className="config-group">
          <label>
            Competition Name:
            <input
              type="text"
              value={competitionName}
              onChange={e => setCompetitionName(e.target.value)}
              placeholder="e.g., Regional Tournament 2026"
            />
          </label>
        </div>
      </div>

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
            First Half Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(firstHalfDuration).minutes}
                onChange={e =>
                  setFirstHalfDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(firstHalfDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(firstHalfDuration).seconds}
                onChange={e =>
                  setFirstHalfDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(firstHalfDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
          </label>

          <label>
            Half Time Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(halfTimeDuration).minutes}
                onChange={e =>
                  setHalfTimeDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(halfTimeDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(halfTimeDuration).seconds}
                onChange={e =>
                  setHalfTimeDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(halfTimeDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
          </label>

          <label>
            Second Half Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(secondHalfDuration).minutes}
                onChange={e =>
                  setSecondHalfDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(secondHalfDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(secondHalfDuration).seconds}
                onChange={e =>
                  setSecondHalfDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(secondHalfDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
          </label>

          <label>
            Between Games Duration:
            <div className="time-input-group">
              <input
                type="number"
                value={secondsToMinutesAndSeconds(betweenGamesDuration).minutes}
                onChange={e =>
                  setBetweenGamesDuration(
                    minutesAndSecondsToSeconds(
                      Number(e.target.value),
                      secondsToMinutesAndSeconds(betweenGamesDuration).seconds
                    )
                  )
                }
                min="0"
                placeholder="mins"
              />
              <span>:</span>
              <input
                type="number"
                value={secondsToMinutesAndSeconds(betweenGamesDuration).seconds}
                onChange={e =>
                  setBetweenGamesDuration(
                    minutesAndSecondsToSeconds(
                      secondsToMinutesAndSeconds(betweenGamesDuration).minutes,
                      Number(e.target.value)
                    )
                  )
                }
                min="0"
                max="59"
                placeholder="secs"
              />
            </div>
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

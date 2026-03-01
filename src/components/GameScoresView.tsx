import React, { useMemo, useState } from 'react';
import { Game, GameResult, Team } from '../types';
import { formatTeamWithDivision, getTeamDivision } from '../utils/teams';
import { resolveGamesFromResults } from '../utils/gameSetupResolution';
import { formatExpectedStartTime } from '../utils/expectedStartTimes';

interface GameScoresViewProps {
  games: Game[];
  teams: Team[];
  results: GameResult[];
  expectedStartTimes: Array<number | null>;
  leftTeamLabel: string;
  rightTeamLabel: string;
  competitionName: string;
}

function GameScoresView({
  games,
  teams,
  results,
  expectedStartTimes,
  leftTeamLabel,
  rightTeamLabel,
  competitionName,
}: GameScoresViewProps) {
  const resolvedGames = resolveGamesFromResults(games, results);
  const [groupByLocation, setGroupByLocation] = useState<boolean>(false);
  const [groupByDivision, setGroupByDivision] = useState<boolean>(false);
  const hasGrouping = groupByLocation || groupByDivision;

  const getDivisionLabel = (game: Game): string => {
    const team1Division = getTeamDivision(teams, game.team1);
    const team2Division = getTeamDivision(teams, game.team2);
    if (team1Division && team2Division) {
      return team1Division === team2Division
        ? team1Division
        : `${team1Division} / ${team2Division}`;
    }
    return team1Division ?? team2Division ?? 'Unassigned';
  };

  const groupedRows = useMemo(() => {
    const rows = resolvedGames.map((game, index) => {
      const result = results[index];
      return {
        game,
        index,
        result,
        location: game.location?.trim() || '—',
        division: getDivisionLabel(game),
      };
    });

    if (!hasGrouping) {
      return [{ label: 'All Games', rows }];
    }

    const groups = new Map<string, typeof rows>();
    rows.forEach(row => {
      const labels: string[] = [];
      if (groupByLocation) {
        labels.push(`Location: ${row.location}`);
      }
      if (groupByDivision) {
        labels.push(`Division: ${row.division}`);
      }
      const key = labels.join(' • ');
      const existingRows = groups.get(key) || [];
      existingRows.push(row);
      groups.set(key, existingRows);
    });

    return Array.from(groups.entries()).map(([label, grouped]) => ({
      label,
      rows: grouped,
    }));
  }, [resolvedGames, results, hasGrouping, groupByLocation, groupByDivision, teams]);

  const exportCsv = (): void => {
    const header = [
      'Game',
      'Expected Start Time',
      'Start Time',
      leftTeamLabel,
      `${leftTeamLabel} Score`,
      rightTeamLabel,
      `${rightTeamLabel} Score`,
    ];

    const rows = resolvedGames.map((game, index) => {
      const result = results[index];
      const startTime = result?.startTime ?? '';
      const leftScore = result?.score?.team1 ?? '';
      const rightScore = result?.score?.team2 ?? '';
      return [
        String(index + 1),
        formatExpectedStartTime(expectedStartTimes[index] ?? null),
        startTime,
        formatTeamWithDivision(teams, game.team1),
        String(leftScore),
        formatTeamWithDivision(teams, game.team2),
        String(rightScore),
      ];
    });

    const escapeCell = (value: string): string => {
      const needsQuotes = /[",\n]/.test(value);
      const escaped = value.replace(/"/g, '""');
      return needsQuotes ? `"${escaped}"` : escaped;
    };

    const csvLines: string[] = [];

    // Add competition name as first line if available
    if (competitionName.trim()) {
      csvLines.push(escapeCell(competitionName));
      csvLines.push(''); // Empty line for spacing
    }

    // Add header and data rows
    const csv = [header, ...rows]
      .map(row => row.map(cell => escapeCell(cell)).join(','))
      .join('\n');

    csvLines.push(csv);
    const finalCsv = csvLines.join('\n');

    const blob = new Blob([finalCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'game-scores.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <div className="scores-page">
      <div className="scores-panel">
        <div className="scores-header">
          <h2>Game Scores</h2>
          <div className="scores-actions">
            <button className="scores-action" onClick={exportCsv} type="button">
              Export CSV
            </button>
            <button className="scores-action" onClick={handlePrint} type="button">
              Print
            </button>
          </div>
        </div>
        <div className="scores-body">
          {competitionName && <div className="scores-competition-name">{competitionName}</div>}
          <div className="grouping-controls">
            <label className="grouping-option">
              <input
                type="checkbox"
                checked={groupByLocation}
                onChange={event => setGroupByLocation(event.target.checked)}
              />
              Group by Location
            </label>
            <label className="grouping-option">
              <input
                type="checkbox"
                checked={groupByDivision}
                onChange={event => setGroupByDivision(event.target.checked)}
              />
              Group by Division
            </label>
          </div>
          {games.length === 0 ? (
            <div className="scores-empty">No games configured.</div>
          ) : (
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Location</th>
                  <th>Expected Start</th>
                  <th>Start Time</th>
                  <th>{leftTeamLabel}</th>
                  <th>Score</th>
                  <th>{rightTeamLabel}</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {groupedRows.map(group => (
                  <React.Fragment key={group.label}>
                    {hasGrouping && (
                      <tr className="table-group-row">
                        <td colSpan={8}>{group.label}</td>
                      </tr>
                    )}
                    {group.rows.map(({ game, index, result, location }) => {
                      const startTime = result?.startTime ?? '—';
                      const hasScore = Boolean(result?.score);
                      const team1Score = result?.score?.team1 ?? '—';
                      const team2Score = result?.score?.team2 ?? '—';
                      const team1Wins = hasScore && Number(team1Score) > Number(team2Score);
                      const team2Wins = hasScore && Number(team2Score) > Number(team1Score);

                      return (
                        <tr key={`${game.team1}-${game.team2}-${index}`}>
                          <td className="scores-game-number">{index + 1}</td>
                          <td>{location}</td>
                          <td className="scores-time-cell">
                            {formatExpectedStartTime(expectedStartTimes[index] ?? null)}
                          </td>
                          <td className="scores-time-cell">{startTime}</td>
                          <td className={team1Wins ? 'scores-winner' : ''}>
                            <strong>{formatTeamWithDivision(teams, game.team1)}</strong>
                          </td>
                          <td className="scores-score-cell">{team1Score}</td>
                          <td className={team2Wins ? 'scores-winner' : ''}>
                            <strong>{formatTeamWithDivision(teams, game.team2)}</strong>
                          </td>
                          <td className="scores-score-cell">{team2Score}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameScoresView;

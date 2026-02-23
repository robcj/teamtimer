import React from 'react';
import { Game, GameResult, Team } from '../types';
import { formatTeamWithDivision } from '../utils/teams';
import { resolveGamesFromResults } from '../utils/drawResolution';
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
          {games.length === 0 ? (
            <div className="scores-empty">No games configured.</div>
          ) : (
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Expected Start</th>
                  <th>Start Time</th>
                  <th>{leftTeamLabel}</th>
                  <th>Score</th>
                  <th>{rightTeamLabel}</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {resolvedGames.map((game, index) => {
                  const result = results[index];
                  const startTime = result?.startTime ?? '—';
                  const hasScore = Boolean(result?.score);
                  const team1Score = result?.score?.team1 ?? '—';
                  const team2Score = result?.score?.team2 ?? '—';
                  const team1Wins = hasScore && Number(team1Score) > Number(team2Score);
                  const team2Wins = hasScore && Number(team2Score) > Number(team1Score);

                  return (
                    <tr key={`${game.team1}-${game.team2}-${index}`}>
                      <td className="scores-game-number">{index + 1}</td>
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
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameScoresView;

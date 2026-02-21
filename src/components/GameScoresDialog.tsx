import React from 'react';
import { Game, GameResult } from '../types';

interface GameScoresDialogProps {
  isOpen: boolean;
  games: Game[];
  results: GameResult[];
  leftTeamLabel: string;
  rightTeamLabel: string;
  competitionName: string;
  onClose: () => void;
}

function GameScoresDialog({
  isOpen,
  games,
  results,
  leftTeamLabel,
  rightTeamLabel,
  competitionName,
  onClose,
}: GameScoresDialogProps) {
  if (!isOpen) {
    return null;
  }

  const exportCsv = (): void => {
    const header = [
      'Game',
      'Start Time',
      leftTeamLabel,
      `${leftTeamLabel} Score`,
      rightTeamLabel,
      `${rightTeamLabel} Score`,
    ];

    const rows = games.map((game, index) => {
      const result = results[index];
      const startTime = result?.startTime ?? '';
      const leftScore = result?.score?.team1 ?? '';
      const rightScore = result?.score?.team2 ?? '';
      return [
        String(index + 1),
        startTime,
        game.team1,
        String(leftScore),
        game.team2,
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
    <div className="scores-dialog-backdrop" onClick={onClose}>
      <div className="scores-dialog" onClick={event => event.stopPropagation()}>
        <div className="scores-dialog-header">
          <h3>Game Scores</h3>
          <div className="scores-dialog-actions">
            <button className="scores-dialog-action" onClick={exportCsv} type="button">
              Export CSV
            </button>
            <button className="scores-dialog-action" onClick={handlePrint} type="button">
              Print
            </button>
            <button className="scores-dialog-close" onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>
        <div className="scores-dialog-body">
          {competitionName && <div className="scores-competition-name">{competitionName}</div>}
          {games.length === 0 ? (
            <div className="scores-empty">No games configured.</div>
          ) : (
            <table className="scores-table">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Start Time</th>
                  <th>{leftTeamLabel}</th>
                  <th>Score</th>
                  <th>{rightTeamLabel}</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, index) => {
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
                      <td className="scores-time-cell">{startTime}</td>
                      <td className={team1Wins ? 'scores-winner' : ''}>
                        <strong>{game.team1}</strong>
                      </td>
                      <td className="scores-score-cell">{team1Score}</td>
                      <td className={team2Wins ? 'scores-winner' : ''}>
                        <strong>{game.team2}</strong>
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

export default GameScoresDialog;

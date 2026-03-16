import React from 'react';
import { Game, Scores } from '@team-timer/core';

export interface PreviousGameSummary {
  game: Game;
  score: Scores | null;
  team1Name: string;
  team2Name: string;
}

export interface NextGameSummary {
  game: Game;
  team1Name: string;
  team2Name: string;
}

interface GameSummaryProps {
  previousGame: PreviousGameSummary | null;
  nextGame: NextGameSummary | null;
}

function GameSummary({ previousGame, nextGame }: GameSummaryProps) {
  return (
    <div className="game-summary">
      <div className="last-game-summary" aria-live="polite">
        <span className="last-game-label">Last game:</span>{' '}
        <span className="last-game-result">
          {previousGame?.team1Name} <b>{previousGame?.score?.team1 ?? '—'}</b> -{' '}
          <b>{previousGame?.score?.team2 ?? '—'}</b> {previousGame?.team2Name}
        </span>
      </div>
      <div className="next-game-summary" aria-live="polite">
        <span className="next-game-label">Next game:</span>{' '}
        <span className="next-game-result">
          {nextGame ? `${nextGame.team1Name} vs ${nextGame.team2Name}` : '—'}
        </span>
      </div>
    </div>
  );
}

export default GameSummary;

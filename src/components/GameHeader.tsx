import React from 'react';
import { Game } from '../types';
import { formatExpectedStartTime } from '../utils/expectedStartTimes';

interface GameHeaderProps {
  game: Game;
  currentIndex: number;
  totalGames: number;
  startTime?: string | null;
  expectedStartTime?: number | null;
}

function GameHeader({
  game,
  currentIndex,
  totalGames,
  startTime = null,
  expectedStartTime = null,
}: GameHeaderProps) {
  const hasActualStartTime = Boolean(startTime);
  const headerStartTimeText = hasActualStartTime
    ? `Started: ${startTime}`
    : expectedStartTime
      ? `Start: ${formatExpectedStartTime(expectedStartTime)}`
      : null;

  return (
    <div className="game-info">
      <div className="game-info-row">
        <h2>
          Game {currentIndex + 1} of {totalGames}: {game.team1} vs {game.team2}
        </h2>
        {headerStartTimeText && <div className="game-start-meta">{headerStartTimeText}</div>}
      </div>
    </div>
  );
}

export default GameHeader;

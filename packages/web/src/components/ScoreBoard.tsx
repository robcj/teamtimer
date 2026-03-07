import React from 'react';
import { Scores, TimerConfig, Game, formatTeamWithDivision } from '@team-timer/core';

interface ScoreBoardProps {
  config: TimerConfig;
  game: Game;
  scores: Scores;
  readOnly?: boolean;
  onIncrement: (team: keyof Scores) => void;
  onDecrement: (team: keyof Scores) => void;
}

function ScoreBoard({
  config,
  game,
  scores,
  readOnly = false,
  onIncrement,
  onDecrement,
}: ScoreBoardProps) {
  const isEmptySlotGame = !game.team1.trim() && !game.team2.trim();
  const disableScoreButtons = readOnly || isEmptySlotGame;

  return (
    <div className="score-display">
      <div className="score-team left-team">
        <div className="team-color-label">{config.leftTeamLabel}</div>
        <div className="team-name">
          {formatTeamWithDivision(config.teams, config.divisions, game.team1)}
        </div>
        <div className="score-row">
          {!readOnly && (
            <button
              onClick={() => onDecrement('team1')}
              className="score-btn minus"
              disabled={disableScoreButtons}
            >
              -
            </button>
          )}
          <div className="score-value">{scores.team1}</div>
          {!readOnly && (
            <button
              onClick={() => onIncrement('team1')}
              className="score-btn plus"
              disabled={disableScoreButtons}
            >
              +
            </button>
          )}
        </div>
      </div>

      <div className="score-team right-team">
        <div className="team-color-label">{config.rightTeamLabel}</div>
        <div className="team-name">
          {formatTeamWithDivision(config.teams, config.divisions, game.team2)}
        </div>
        <div className="score-row">
          {!readOnly && (
            <button
              onClick={() => onDecrement('team2')}
              className="score-btn minus"
              disabled={disableScoreButtons}
            >
              -
            </button>
          )}
          <div className="score-value">{scores.team2}</div>
          {!readOnly && (
            <button
              onClick={() => onIncrement('team2')}
              className="score-btn plus"
              disabled={disableScoreButtons}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;

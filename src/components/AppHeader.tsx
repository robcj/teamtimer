import React from 'react';
import { ViewType } from '../types';

interface AppHeaderProps {
  view: ViewType;
  competitionName?: string;
  onOpenScores: () => void;
  onOpenDraw: () => void;
  onOpenConfig: () => void;
}

function AppHeader({
  view,
  competitionName,
  onOpenScores,
  onOpenDraw,
  onOpenConfig,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-title">
        <h1>Team Timer</h1>
      </div>
      {competitionName && <p className="competition-name">{competitionName}</p>}
      <div className="header-buttons">
        {view === 'timer' && (
          <button onClick={onOpenScores} className="config-button scores-header-button">
            Game Scores
          </button>
        )}
        {view === 'timer' && (
          <button onClick={onOpenDraw} className="config-button">
            Draw
          </button>
        )}
        {view === 'timer' && (
          <button onClick={onOpenConfig} className="config-button">
            Configuration
          </button>
        )}
      </div>
    </header>
  );
}

export default AppHeader;

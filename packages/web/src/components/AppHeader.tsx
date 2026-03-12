import React from 'react';
import { ViewType } from '@team-timer/core';
import HeaderMenu from './HeaderMenu';

interface AppHeaderProps {
  view: ViewType;
  competitionName?: string;
  globalControlLabel?: string;
  headerStatusText?: string;
  onOpenScores: () => void;
  onOpenSetup: () => void;
  onOpenGuide: () => void;
  onViewTimer: () => void;
  onGlobalControl?: () => void;
  onOpenSecondScreen?: () => void;
  onResetAll?: () => void;
  onClearAllData?: () => void;
  canToggleLayout?: boolean;
  isSplitLayout?: boolean;
  onSetSingleLayout?: () => void;
  onSetSplitLayout?: () => void;
}

function AppHeader({
  view,
  competitionName,
  globalControlLabel,
  headerStatusText,
  onOpenScores,
  onOpenSetup,
  onOpenGuide,
  onViewTimer,
  onGlobalControl,
  onOpenSecondScreen,
  onResetAll,
  onClearAllData,
  canToggleLayout = false,
  isSplitLayout = false,
  onSetSingleLayout,
  onSetSplitLayout,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div
        className="header-title"
        onClick={() => {
          onViewTimer();
        }}
      >
        <h1>
          Team
          <br />
          Timer
        </h1>
      </div>
      {competitionName && (
        <p className="competition-name">
          {competitionName}{' '}
          {headerStatusText && <small className="header-status-hint">{headerStatusText}</small>}
        </p>
      )}

      <div className="header-actions">
        {globalControlLabel && onGlobalControl && (
          <button className="config-button" onClick={onGlobalControl}>
            {globalControlLabel}
          </button>
        )}
        <HeaderMenu
          view={view}
          onViewTimer={onViewTimer}
          onOpenScores={onOpenScores}
          onOpenSetup={onOpenSetup}
          onOpenGuide={onOpenGuide}
          canToggleLayout={canToggleLayout}
          isSplitLayout={isSplitLayout}
          onSetSingleLayout={onSetSingleLayout}
          onSetSplitLayout={onSetSplitLayout}
          onOpenSecondScreen={onOpenSecondScreen}
          onResetAll={onResetAll}
          onClearAllData={onClearAllData}
        />
      </div>
    </header>
  );
}

export default AppHeader;

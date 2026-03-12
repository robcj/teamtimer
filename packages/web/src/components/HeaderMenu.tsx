import React from 'react';
import { ViewType } from '@team-timer/core';

interface HeaderMenuProps {
  view: ViewType;
  onViewTimer: () => void;
  onOpenScores: () => void;
  onOpenSetup: () => void;
  onOpenGuide: () => void;
  canToggleLayout?: boolean;
  isSplitLayout?: boolean;
  onSetSingleLayout?: () => void;
  onSetSplitLayout?: () => void;
  onOpenSecondScreen?: () => void;
  onResetAll?: () => void;
  onClearAllData?: () => void;
}

function HeaderMenu({
  view,
  onViewTimer,
  onOpenScores,
  onOpenSetup,
  onOpenGuide,
  canToggleLayout = false,
  isSplitLayout = false,
  onSetSingleLayout,
  onSetSplitLayout,
  onOpenSecondScreen,
  onResetAll,
  onClearAllData,
}: HeaderMenuProps) {
  const closeMenu = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
    const menu = event.currentTarget.closest('details');
    if (menu) {
      menu.removeAttribute('open');
    }
  };

  return (
    <details className="header-menu">
      <summary className="config-button header-menu-trigger">Menu ▾</summary>
      <div className="header-menu-list">
        <button
          onClick={event => {
            closeMenu(event);
            onViewTimer();
          }}
          className={`header-menu-item ${view === 'timer' ? 'active' : ''}`}
        >
          Timer
        </button>
        <button
          onClick={event => {
            closeMenu(event);
            onOpenScores();
          }}
          className={`header-menu-item ${view === 'scores' ? 'active' : ''}`}
        >
          Results
        </button>
        <button
          onClick={event => {
            closeMenu(event);
            onOpenSetup();
          }}
          className={`header-menu-item ${view === 'setup' ? 'active' : ''}`}
        >
          Setup
        </button>
        <button
          onClick={event => {
            closeMenu(event);
            onOpenGuide();
          }}
          className={`header-menu-item ${view === 'guide' ? 'active' : ''}`}
        >
          User Guide
        </button>
        {canToggleLayout && onSetSingleLayout && isSplitLayout && (
          <button
            onClick={event => {
              closeMenu(event);
              onSetSingleLayout();
            }}
            className={`header-menu-item ${!isSplitLayout ? 'active' : ''}`}
          >
            Single Scoreboard
          </button>
        )}
        {canToggleLayout && onSetSplitLayout && !isSplitLayout && (
          <button
            onClick={event => {
              closeMenu(event);
              onSetSplitLayout();
            }}
            className={`header-menu-item ${isSplitLayout ? 'active' : ''}`}
          >
            Split Scoreboard
          </button>
        )}
        {onOpenSecondScreen && (
          <button
            onClick={event => {
              closeMenu(event);
              onOpenSecondScreen();
            }}
            className="header-menu-item"
          >
            Second Screen
          </button>
        )}
        <a
          href="dist-single/team-timer-offline.html"
          download="team-timer.html"
          onClick={event => {
            closeMenu(event);
          }}
          className="header-menu-item"
        >
          Download Offline App
        </a>
        {onResetAll && (
          <button
            onClick={event => {
              closeMenu(event);
              onResetAll();
            }}
            className="header-menu-item"
          >
            Reset All
          </button>
        )}
        {onClearAllData && (
          <button
            onClick={event => {
              closeMenu(event);
              onClearAllData();
            }}
            className="header-menu-item"
          >
            Clear All Data
          </button>
        )}
      </div>
    </details>
  );
}

export default HeaderMenu;

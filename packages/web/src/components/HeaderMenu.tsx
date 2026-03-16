import React from 'react';
import { ViewType } from '@team-timer/core';
import { isMobileApp } from '../utils/platform';

interface HeaderMenuProps {
  view: ViewType;
  onViewTimer: () => void;
  onOpenScores: () => void;
  onOpenSetup: () => void;
  onOpenGuide: () => void;
  onOpenAbout: () => void;
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
  onOpenAbout,
  canToggleLayout = false,
  isSplitLayout = false,
  onSetSingleLayout,
  onSetSplitLayout,
  onOpenSecondScreen,
  onResetAll,
  onClearAllData,
}: HeaderMenuProps) {
  const runningInMobileApp = isMobileApp();

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
        {onOpenSecondScreen && !runningInMobileApp && (
          <button
            onClick={event => {
              closeMenu(event);
              onOpenSecondScreen();
            }}
            className="header-menu-item"
          >
            Additional Screen
          </button>
        )}
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
        <button
          onClick={event => {
            closeMenu(event);
            onOpenGuide();
          }}
          className={`header-menu-item ${view === 'guide' ? 'active' : ''}`}
        >
          User Guide
        </button>
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
        <button
          onClick={event => {
            closeMenu(event);
            onOpenAbout();
          }}
          className={`header-menu-item ${view === 'about' ? 'active' : ''}`}
        >
          About
        </button>
      </div>
    </details>
  );
}

export default HeaderMenu;

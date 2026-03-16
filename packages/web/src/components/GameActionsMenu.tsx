import React, { useRef, useState } from 'react';

interface GameActionsMenuProps {
  onReset: () => void;
  onSkipPhase: () => void;
  canSkip: boolean;
}

function GameActionsMenu({ onReset, onSkipPhase, canSkip }: GameActionsMenuProps) {
  const [openUpwards, setOpenUpwards] = useState<boolean>(false);
  const menuRef = useRef<HTMLDetailsElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = (): void => {
    const menu = menuRef.current;
    if (!menu || !menu.open) {
      setOpenUpwards(false);
      return;
    }

    const menuRect = menu.getBoundingClientRect();
    const spaceBelow = window.innerHeight - menuRect.bottom;
    const listHeight = listRef.current?.offsetHeight ?? 170;
    setOpenUpwards(spaceBelow < listHeight + 12);
  };

  const closeMenu = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const menu = event.currentTarget.closest('details');
    if (menu) {
      menu.removeAttribute('open');
      setOpenUpwards(false);
    }
  };

  return (
    <details
      ref={menuRef}
      className={`game-actions-menu ${openUpwards ? 'open-upwards' : ''}`}
      role="group"
      onToggle={handleToggle}
    >
      <summary className="game-actions-trigger">Actions ▾</summary>
      <div ref={listRef} className="game-actions-list">
        <button
          className="compact-action-item"
          onClick={event => {
            closeMenu(event);
            onReset();
          }}
        >
          Reset
        </button>
        <button
          className="compact-action-item"
          disabled={!canSkip}
          onClick={event => {
            closeMenu(event);
            onSkipPhase();
          }}
        >
          Skip Phase
        </button>
      </div>
    </details>
  );
}

export default GameActionsMenu;

import React from 'react';

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, isOpen, onToggle, children }: CollapsibleSectionProps) {
  return (
    <div className="config-section">
      <div className="config-section-header">
        <h3>{title}</h3>
        <button
          type="button"
          className="section-toggle-btn"
          onClick={onToggle}
          aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>
      {isOpen && children}
    </div>
  );
}

export default CollapsibleSection;

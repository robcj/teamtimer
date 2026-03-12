import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`config-section ${isOpen ? '' : 'collapsed'}`}>
      <div className="config-section-header" onClick={handleToggle}>
        <h3>{title}</h3>
        <button
          type="button"
          className="section-toggle-btn"
          aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
          aria-expanded={isOpen}
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>
      {isOpen && children}
    </div>
  );
}

export default CollapsibleSection;

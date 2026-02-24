import React, { ChangeEvent } from 'react';

interface ImportExportSectionProps {
  onExportConfig: () => void;
  onImportConfig: (event: ChangeEvent<HTMLInputElement>) => void;
}

function ImportExportSection({ onExportConfig, onImportConfig }: ImportExportSectionProps) {
  return (
    <div className="config-section">
      <h3>Import / Export</h3>
      <div className="import-export">
        <button onClick={onExportConfig} className="export-btn">
          Export Configuration
        </button>
        <label className="import-btn">
          Import Configuration
          <input type="file" accept=".json" onChange={onImportConfig} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
}

export default ImportExportSection;

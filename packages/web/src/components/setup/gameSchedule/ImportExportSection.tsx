import React, { ChangeEvent } from 'react';

interface ImportExportSectionProps {
  onExportConfig: () => void;
  onImportConfig: (event: ChangeEvent<HTMLInputElement>) => void;
  onLoadDemoConfig: () => void;
  onClearConfiguration: () => void;
}

function ImportExportSection({
  onExportConfig,
  onImportConfig,
  onLoadDemoConfig,
  onClearConfiguration,
}: ImportExportSectionProps) {
  return (
    <div className="import-export">
      <button onClick={onExportConfig} className="export-btn">
        Export Configuration
      </button>
      <label className="import-btn">
        Import Configuration
        <input type="file" accept=".json" onChange={onImportConfig} style={{ display: 'none' }} />
      </label>
      <button
        onClick={() => {
          const confirmed = window.confirm(
            'Clear all saved game and configuration data, and load the demo configuration which has 10-second games to demonstrate functionality.\n' +
              'It is recommended that you export your configuration and game data before proceeding. Are you sure you want to continue?'
          );
          if (!confirmed) {
            return;
          }
          onLoadDemoConfig();
        }}
        className="import-btn"
      >
        Load Demo Configuration
      </button>

      <button
        onClick={() => {
          const confirmed = window.confirm(
            'Clear all saved game and configuration data. This cannot be undone.\n' +
              'It is recommended that you export your configuration and game data before proceeding. Are you sure you want to continue?'
          );
          if (!confirmed) {
            return;
          }
          onClearConfiguration();
        }}
        className="import-btn"
      >
        Clear Configuration
      </button>
    </div>
  );
}

export default ImportExportSection;

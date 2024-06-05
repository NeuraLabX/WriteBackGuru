import React, { useState, useEffect } from 'react';

// Declare tableau object globally
declare const tableau: any;

interface DataRefSelectorProps {
  label: string;
  onSelect: (sheetName: string) => void;
}

const DataRefSelector: React.FC<DataRefSelectorProps> = ({ label, onSelect }) => {
  const [sheets, setSheets] = useState<tableau.Sheet[]>([]);

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      setSheets(dashboard.worksheets);
    });
  }, []);

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <div className="input-field">
      <label htmlFor={label}>{label}:</label>
      <select id={label} onChange={handleSelect}>
        <option value="">Select Sheet</option>
        {sheets.map((sheet) => (
          <option key={sheet.id} value={sheet.name}>
            {sheet.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DataRefSelector;

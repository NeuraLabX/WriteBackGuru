import React, { useEffect, useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import DataRefSelector from './components/DataRefSelector';
import InputField from './components/InputField';
import { validateInput as validateField } from './utils/validation';

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [fields, setFields] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      setIsInitialized(true);
      const savedSettings = tableau.extensions.settings.getAll();
      setSettings(savedSettings);
    });
  }, []);

  const handleSaveSettings = () => {
    tableau.extensions.settings.set('fields', JSON.stringify(fields));
    tableau.extensions.settings.saveAsync().then(() => {
      console.log('Settings saved successfully');
    });
  };

  const handleFieldChange = (index: number, value: any) => {
    const updatedFields = [...fields];
    updatedFields[index] = value;
    setFields(updatedFields);
  };

  const handleValidation = () => {
    const isValid = fields.every(field => validateField(field));
    if (isValid) {
      console.log('All fields are valid');
    } else {
      console.log('Some fields are invalid');
    }
  };

  return (
    <div>
      <h1>WriteBack Guru</h1>
      {isInitialized ? (
        <div>
          <ConfigPanel
            fields={fields}
            onFieldChange={handleFieldChange}
          />
          <DataRefSelector
            onSelectSheet={(sheet: any) => console.log(`Selected sheet: ${sheet.name}`)}
          />
          <button onClick={handleSaveSettings}>Save Settings</button>
          <button onClick={handleValidation}>Validate Fields</button>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default App;

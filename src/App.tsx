import React, { useState, useEffect } from 'react';
import ConfigPanel from './components/ConfigPanel';
import InputField from './components/InputField';
import DataRefSelector from './components/DataRefSelector';
import database from './utils/database';
import { logEntry } from './utils/logger';
import { encrypt, decrypt } from './utils/encryption';
import DOMPurify from 'dompurify';

// Get the tableau object from the global scope (provided by Tableau)
declare const tableau: any;

const App: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [submissionStatus, setSubmissionStatus] = useState<string | React.ReactNode | null>(null);

  useEffect(() => {
    tableau.extensions.initializeAsync().then(() => {
      loadConfig().then((savedConfig) => {
        if (savedConfig) {
          setConfig(savedConfig);
          setIsConfigured(true);
          logEntry('Configuration loaded', savedConfig);
        }
      });
    });
  }, []);

  const saveConfig = async (newConfig: any) => {
    try {
      // Encrypt database credentials before saving
      newConfig.dbCredentials = encrypt(JSON.stringify(newConfig.dbCredentials));

      await tableau.extensions.settings.set('config', JSON.stringify(newConfig));
      await tableau.extensions.settings.saveAsync();
      setConfig(newConfig);
      setIsConfigured(true);
      logEntry('Configuration saved', newConfig);
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Handle the error appropriately (e.g., display a user-friendly error message)
    }
  };

  const loadConfig = async () => {
    const configSetting = await tableau.extensions.settings.get('config');
    return configSetting ? JSON.parse(configSetting) : null;
  };

  const handleInputChange = (fieldName: string, value: any) => {
    // Sanitize user input
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData({ ...formData, [fieldName]: sanitizedValue });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmissionStatus(<span><i className="fas fa-spinner fa-spin"></i> Submitting...</span>);

    try {
      validateData(config.fields, formData);

      const decryptedCredentials = decrypt(config.dbCredentials);
      await database.connect(config.targetDatabase, decryptedCredentials);

      const referencedData = await getReferencedData(config.targetSheet);
      const dataToWrite = { ...referencedData, ...formData };

      await database.save(dataToWrite, config.targetTable, config.targetDatabase, config);

      logEntry('Data saved successfully', { data: dataToWrite });
      setSubmissionStatus(<span style={{ color: 'green' }}><i className="fas fa-check-circle"></i> Data saved successfully!</span>);
    } catch (error: any) {
      console.error('Error submitting data:', error);
      logEntry('Error saving data', { error: error.message });
      setSubmissionStatus(<span style={{ color: 'red' }}><i className="fas fa-exclamation-triangle"></i> Error: {error.message}</span>);
    } finally {
      await database.disconnect();
    }
  };

  const validateData = (fields: any[], data: any) => {
    for (const field of fields) {
      const value = data[field.name];
      if (field.required && !value) {
        throw new Error(`Field "${field.name}" is required.`);
      }

      switch (field.type) {
        case 'number':
          if (isNaN(value) || value === '') {
            throw new Error(`Field "${field.name}" must be a valid number.`);
          }
          break;
        case 'integer':
          if (!Number.isInteger(Number(value)) || value === '') {
            throw new Error(`Field "${field.name}" must be a valid integer.`);
          }
          break;
        // Add more validation cases for different data types as needed
        default:
          if (typeof value !== 'string') {
            throw new Error(`Field "${field.name}" must be a valid text.`);
          }
      }
    }
  };

  const getReferencedData = async (sheetName: string) => {
    try {
      const worksheet = tableau.extensions.dashboardContent.dashboard.worksheets.find(
        (sheet) => sheet.name === sheetName
      );

      if (!worksheet) {
        throw new Error(`Sheet "${sheetName}" not found.`);
      }

      const sheetData = await worksheet.getSummaryDataAsync();
      const firstRow = sheetData.data[0];
      const referencedData: any = {};

      sheetData.columns.forEach((column, index) => {
        referencedData[column.fieldName] = firstRow[index].value;
      });

      return referencedData;
    } catch (error) {
      console.error('Error fetching referenced data:', error);
      throw error;
    }
  };

  return (
    <div>
      {!isConfigured && <ConfigPanel onSave={saveConfig} />}
      {isConfigured && (
        <div className="data-input-panel">
          <h2>Data Input for {config.targetSheet}</h2>
          <form onSubmit={handleSubmit}>
            {config.fields.map((field: any, index: number) => (
              <InputField
                key={index}
                label={field.name}
                type={getAppropriateInputType(field.type)}
                value={formData[field.name] || ''}
                onChange={(value: any) => handleInputChange(field.name, value)}
                placeholder={field.placeholder}
                validation={field.validation}
                customValidation={field.customValidation}
                required={field.required}
              />
            ))}
            <button type="submit">Save Data</button>
            {submissionStatus && (
              <p style={{ color: submissionStatus.toString().startsWith('Error') ? 'red' : 'green' }}>
                {submissionStatus}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

const getAppropriateInputType = (fieldType: string) => {
  switch (fieldType) {
    case 'number':
      return 'number';
    case 'integer':
      return 'number';
    case 'date':
      return 'date';
    case 'textarea':
      return 'textarea';
    // Add more mappings as needed
    default:
      return 'text';
  }
};

export default App;

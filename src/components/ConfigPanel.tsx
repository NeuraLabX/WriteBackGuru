import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import DataRefSelector from './DataRefSelector';
import { logEntry } from '../utils/logger';
import database from '../utils/database';
import { encrypt } from '../utils/encryption';

// Declare the tableau object globally
declare const tableau: any;

interface Field {
  name: string;
  type: string;
  options?: string[];
  required?: boolean;
  customValidation?: (value: any) => string | null;
}

interface ConfigPanelProps {
  fields: Field[];
  onFieldChange: (index: number, value: Field) => void;
  onSave: (config: any) => Promise<void>;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ fields, onFieldChange, onSave }) => {
  const [targetDatabase, setTargetDatabase] = useState<string>('TableauServer');
  const [dbCredentials, setDbCredentials] = useState<any>({});
  const [targetSheet, setTargetSheet] = useState<string>('');
  const [targetTable, setTargetTable] = useState<string>('');
  const [datasources, setDatasources] = useState<any[]>([]);
  const [selectedDatasourceId, setSelectedDatasourceId] = useState<string>('');
  const [logicalTables, setLogicalTables] = useState<any[]>([]);
  const [testConnectionStatus, setTestConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataSources = async () => {
      const ds = await tableau.extensions.datasource.getDataSourcesAsync();
      setDatasources(ds);
    };

    fetchDataSources();
  }, []);

  useEffect(() => {
    const fetchLogicalTables = async () => {
      if (selectedDatasourceId) {
        const selectedDatasource = datasources.find(ds => ds.id === selectedDatasourceId);
        if (selectedDatasource) {
          const tables = await selectedDatasource.getConnection().getLogicalTablesAsync();
          setLogicalTables(tables);
        }
      }
    };

    fetchLogicalTables();
  }, [selectedDatasourceId]);

  const handleDatabaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetDatabase(event.target.value);
    setDbCredentials({});
    setSelectedDatasourceId('');
    setLogicalTables([]);
  };

  const handleCredentialsChange = (fieldName: string, value: string) => {
    setDbCredentials({ ...dbCredentials, [fieldName]: value });
  };

  const handleSheetChange = (sheetName: string) => {
    setTargetSheet(sheetName);
  };

  const handleAddField = () => {
    onFieldChange(fields.length, { name: '', type: 'text', options: [], required: false });
  };

  const handleFieldChange = (index: number, updatedField: Field) => {
    onFieldChange(index, updatedField);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    updatedFields.forEach((field, i) => onFieldChange(i, field));
  };

  const handleLogicalTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetTable(event.target.value);
  };

  const handleTestConnection = async () => {
    setTestConnectionStatus('Testing...');
    try {
      const encryptedCredentials = encrypt(JSON.stringify(dbCredentials));
      const sequelize = await database.connect(targetDatabase, encryptedCredentials);
      await database.disconnect(sequelize);
      setTestConnectionStatus('Connection successful!');
    } catch (error: any) {
      console.error('Connection test failed:', error);
      setTestConnectionStatus(`Connection failed: ${error.message}`);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const config = {
        targetDatabase,
        dbCredentials,
        targetSheet,
        fields,
        targetTable
      };
      await onSave(config);
      logEntry('Configuration saved', config);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  return (
    <div className='config-panel'>
      <h2>WriteBack Guru Configuration</h2>
      <form onSubmit={handleSubmit}>
        <h3>Target Database</h3>
        <InputField
          label="Database Type"
          type="select"
          value={targetDatabase}
          onChange={handleDatabaseChange}
          options={['TableauServer', 'Oracle', 'MSSQL', 'PostgreSQL']}
        />

        {targetDatabase !== 'TableauServer' && (
          <div>
            <InputField
              label="Host"
              type="text"
              value={dbCredentials.host || ''}
              onChange={(value) => handleCredentialsChange('host', value)}
              placeholder="Enter database host"
              required
            />
            <InputField
              label="Port"
              type="number"
              value={dbCredentials.port || ''}
              onChange={(value) => handleCredentialsChange('port', value)}
              placeholder="Enter database port"
              required
            />
            <InputField
              label="Database Name"
              type="text"
              value={dbCredentials.database || ''}
              onChange={(value) => handleCredentialsChange('database', value)}
              placeholder="Enter database name"
              required
            />
            <InputField
              label="Username"
              type="text"
              value={dbCredentials.username || ''}
              onChange={(value) => handleCredentialsChange('username', value)}
              placeholder="Enter database username"
              required
            />
            <InputField
              label="Password"
              type="password"
              value={dbCredentials.password || ''}
              onChange={(value) => handleCredentialsChange('password', value)}
              placeholder="Enter database password"
              required
            />
            <button type="button" onClick={handleTestConnection}>
              Test Connection
            </button>
            {testConnectionStatus && (
              <p style={{ color: testConnectionStatus.startsWith('Connection successful') ? 'green' : 'red' }}>
                {testConnectionStatus}
              </p>
            )}
          </div>
        )}

        <h3>Target Sheet and Table</h3>
        <DataRefSelector label="Target Sheet" onSelect={handleSheetChange} />

        {targetDatabase !== 'TableauServer' && (
          <div>
            <label htmlFor="logicalTable">Target Table:</label>
            <select id="logicalTable" value={targetTable} onChange={handleLogicalTableChange} disabled={!selectedDatasourceId}>
              <option value="">Select Table</option>
              {logicalTables.map((table) => (
                <option key={table.id} value={table.name}>
                  {table.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <h3>Input Fields</h3>
        <ul>
          {fields.map((field, index) => (
            <li key={index}>
              <InputField
                label="Field Name"
                type="text"
                value={field.name}
                onChange={(value) => handleFieldChange(index, { ...field, name: value })}
                required
              />
              <InputField
                label="Field Type"
                type="select"
                value={field.type}
                onChange={(value) => handleFieldChange(index, { ...field, type: value })}
                options={['text', 'number', 'integer', 'date', 'textarea', 'select']}
              />
              {field.type === 'select' && (
                <InputField
                  label="Dropdown Options (comma-separated)"
                  type="text"
                  value={field.options ? field.options.join(',') : ''}
                  onChange={(value) =>
                    handleFieldChange(index, {
                      ...field,
                      options: value.split(',').map((option: string) => option.trim())  // Fix: Explicitly typed 'option' as 'string'
                    })
                  }
                />
              )}
              <label>
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => handleFieldChange(index, { ...field, required: e.target.checked })}
                />
                Required
              </label>
              <InputField
                label="Custom Validation (Optional)"
                type="text"
                value={field.customValidation || ''}
                onChange={(value) => handleFieldChange(index, { ...field, customValidation: value })}
                placeholder="Enter a JavaScript validation function (e.g., 'value => value.length > 5 ? null : \'Too short\'')"
              />
              <button type="button" onClick={() => handleRemoveField(index)}>
                Remove Field
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={handleAddField}>
          Add Field
        </button>

        <button type="submit" disabled={!targetSheet || (targetDatabase !== 'TableauServer' && !targetTable)}>
          Save Configuration
        </button>
      </form>
    </div>
  );
};

export default ConfigPanel;

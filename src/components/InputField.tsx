import React, { useState } from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: any;
  onChange: (value: any) => void;
  options?: string[]; 
  placeholder?: string;
  validation?: (value: any) => string | null; 
  customValidation?: (value: any) => string | null;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type, 
  value, 
  onChange, 
  options, 
  placeholder, 
  validation, 
  customValidation,
  required 
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = event.target.value;
    onChange(newValue); 

    // Apply validation if a validation function is provided
    if (validation) {
      const validationResult = validation(newValue); 
      setError(validationResult); 
    } else {
      setError(null);
    }

    // Apply custom validation (if defined)
    if (customValidation) {
      const customValidationResult = customValidation(newValue);
      setError(customValidationResult);
    } else {
      setError(null);
    }
  };

  // Conditional Rendering for Different Input Types
  if (type === 'select' && options) {
    return (
      <div className="input-field">
        <label htmlFor={label}>{label}:</label>
        <select id={label} value={value} onChange={handleChange} required={required}> 
          <option value="">Select an option</option>
          {options.map((option) => ( 
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>} 
      </div>
    );
  } else if (type === 'textarea') {
    return (
      <div className="input-field">
        <label htmlFor={label}>{label}:</label>
        <textarea id={label} value={value} onChange={handleChange} placeholder={placeholder} required={required} /> 
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  } else {
    return (
      <div className="input-field">
        <label htmlFor={label}>{label}:</label>
        <input 
          type={type} 
          id={label} 
          value={value} 
          onChange={handleChange} 
          placeholder={placeholder} 
          required={required} 
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }
};

export default InputField;

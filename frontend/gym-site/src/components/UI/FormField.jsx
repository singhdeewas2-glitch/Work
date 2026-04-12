/*
Form Field Component
Reusable form field component with consistent styling and validation
Supports input, textarea, and select elements
*/

import React from 'react';
import './FormField.css';

const FormField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  disabled = false, 
  error = '', 
  helperText = '', 
  rows = 4,
  options = [],
  className = '',
  ...props 
}) => {
  const baseClasses = 'form-field';
  const errorClasses = error ? 'form-field-error' : '';
  const disabledClasses = disabled ? 'form-field-disabled' : '';
  
  const classes = [
    baseClasses,
    errorClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const renderInput = () => {
    const commonProps = {
      name,
      value: value || '',
      onChange,
      placeholder,
      required,
      disabled,
      ...props
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className="form-field-textarea"
          />
        );
      case 'select':
        return (
          <select {...commonProps} className="form-field-select">
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            {...commonProps}
            type={type}
            className="form-field-input"
          />
        );
    }
  };

  return (
    <div className={classes}>
      {label && (
        <label className="form-field-label" htmlFor={name}>
          {label}
          {required && <span className="form-field-required">*</span>}
        </label>
      )}
      <div className="form-field-input-wrapper">
        {renderInput()}
        {error && (
          <span className="form-field-error-message">{error}</span>
        )}
      </div>
      {helperText && (
        <span className="form-field-helper-text">{helperText}</span>
      )}
    </div>
  );
};

export default FormField;

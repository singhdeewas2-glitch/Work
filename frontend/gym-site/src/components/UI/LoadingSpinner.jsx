/*
Loading Spinner Component
Reusable loading spinner with consistent styling
Supports different sizes and variants
*/

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  variant = 'primary', 
  text = '', 
  className = '',
  overlay = false 
}) => {
  const baseClasses = 'loading-spinner';
  const sizeClasses = `loading-spinner-${size}`;
  const variantClasses = `loading-spinner-${variant}`;
  const overlayClasses = overlay ? 'loading-spinner-overlay' : '';
  
  const classes = [
    baseClasses,
    sizeClasses,
    variantClasses,
    overlayClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="loading-spinner-circle" />
      {text && <span className="loading-spinner-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;

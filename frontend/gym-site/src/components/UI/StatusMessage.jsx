/*
Status Message Component
Reusable status message component for success, error, and info messages
Consistent styling and auto-dismiss functionality
*/

import React, { useEffect, useState } from 'react';
import './StatusMessage.css';

const StatusMessage = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onDismiss, 
  className = '',
  showIcon = true 
}) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
  }, [message]);

  useEffect(() => {
    let timer = null;
    if (visible && duration > 0) {
      timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible, duration, onDismiss]);

  if (!visible || !message) return null;

  const baseClasses = 'status-message';
  const typeClasses = `status-message-${type}`;
  const classes = [baseClasses, typeClasses, className].filter(Boolean).join(' ');

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className={classes}>
      {showIcon && (
        <span className={`status-message-icon status-message-icon-${getIcon()}`} />
      )}
      <span className="status-message-text">{message}</span>
      {onDismiss && (
        <button 
          className="status-message-close" 
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default StatusMessage;

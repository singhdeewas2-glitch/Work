/*
Reusable Contact Button Components
WhatsApp, Call, and Plan-specific join buttons
Uses centralized contact configuration
*/

import React from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import { getWhatsAppLink, getCallLink, getPlanWhatsAppLink } from '../../contact/WhatsApp';

/**
 * WhatsApp Button Component
 * Opens WhatsApp chat with default or custom message
 */
export const WhatsAppButton = ({ message = null, children = "WhatsApp Us", className = "" }) => {
  const whatsappUrl = message ? getWhatsAppLink(message) : getWhatsAppLink();
  
  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-whatsapp ${className}`}
    >
      <FaWhatsapp size={18} /> {children}
    </a>
  );
};

/**
 * Call Button Component
 * Opens phone dialer
 */
export const CallButton = ({ children = "Call Us", className = "" }) => {
  return (
    <a 
      href={getCallLink()}
      className={`btn btn-outline ${className}`}
    >
      <FaPhone size={16} /> {children}
    </a>
  );
};

/**
 * Join Plan Button Component
 * Opens WhatsApp with plan-specific message
 */
export const JoinPlanButton = ({ planType, planTitle, className = "" }) => {
  const whatsappUrl = getPlanWhatsAppLink(planType);
  
  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-primary ${className}`}
    >
      Join {planTitle}
    </a>
  );
};

export default {
  WhatsAppButton,
  CallButton,
  JoinPlanButton
};

/*
Reusable Contact Button Components
WhatsApp, Call, and Plan-specific join buttons
Uses centralized contact configuration
*/

import React from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

import { useConfig } from '../../context/ConfigContext';

/**
 * WhatsApp Button Component
 * Opens WhatsApp chat with default or custom message
 */
export const WhatsAppButton = ({ message = null, children = "WhatsApp Us", className = "" }) => {
  const { config } = useConfig();
  const number = config?.whatsapp || '';
  const defaultMessage = message || "Hello!";
  const whatsappUrl = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;
  
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
  const { config } = useConfig();
  const phone = config?.phone || '';
  return (
    <a 
      href={`tel:${phone}`}
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
  const { config } = useConfig();
  const number = config?.whatsapp || '';
  const planMessage = "I am interested in joining the " + (planType || planTitle) + " plan.";
  const whatsappUrl = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(planMessage)}`;
  
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

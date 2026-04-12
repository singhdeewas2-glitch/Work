/*
WhatsApp Contact System
Centralized control for all contact functionality
WhatsApp, Phone, Plans, Location, and Address management
*/

export const contactConfig = {
  phone: "+918389044375",

  whatsapp: {
    number: "918389044375",
    defaultMessage: "Shri Radha Krishna."
  },

  plans: {
    monthly: "Hello, I want to join Monthly Plan Deewas.",
    quarterly: "Hello, I want to join Quarterly Plan.",
    personal: "Hello, I want Personal Training."
  },

  location: {
    lat: 28.6139,
    lng: 77.2090,
    address: "Knockout MMA & Gym-Uttam Nagar 1 Main, Matiala Rd, Sukh Ram Park, Matiala, New Delhi, Delhi, 110059"
  },

  email: {
    address: "info@gymfit.com",
    subject: "Gym Membership Inquiry"
  },

  hours: {
    weekdays: "Mon-Fri: 5AM-11PM",
    weekends: "Sat-Sun: 6AM-10PM"
  }
};

/**
 * Generate WhatsApp link with custom message
 * @param {string} message - Custom message (optional)
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppLink = (message = null) => {
  const finalMessage = message || contactConfig.whatsapp.defaultMessage;
  const number = contactConfig.whatsapp.number;
  return `https://wa.me/${number}?text=${encodeURIComponent(finalMessage)}`;
};

/**
 * Generate phone call link
 * @returns {string} Tel link
 */
export const getCallLink = () => {
  return `tel:${contactConfig.phone}`;
};

/**
 * Generate Google Maps embed URL
 * @returns {string} Google Maps embed URL
 */
export const getMapEmbedUrl = () => {
  const query = encodeURIComponent(contactConfig.location.address);
  return `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
};

/**
 * Generate Google Maps link for opening in browser
 * @returns {string} Google Maps URL
 */
export const getMapLink = () => {
  return `https://maps.app.goo.gl/YwB8oqxpKFCVXXv9A`;
};

/**
 * Generate email link
 * @param {string} customSubject - Optional custom subject
 * @returns {string} Mailto link
 */
export const getEmailLink = (customSubject = null) => {
  const subject = customSubject || contactConfig.email.subject;
  const encodedSubject = encodeURIComponent(subject);
  return `mailto:${contactConfig.email.address}?subject=${encodedSubject}`;
};

/**
 * Get plan-specific WhatsApp message
 * @param {string} planType - Type of plan (monthly, quarterly, personal)
 * @returns {string} WhatsApp URL with plan-specific message
 */
export const getPlanWhatsAppLink = (planType) => {
  const planMessage = contactConfig.plans[planType];
  if (!planMessage) {
    return getWhatsAppLink();
  }
  return getWhatsAppLink(planMessage);
};

export default contactConfig;

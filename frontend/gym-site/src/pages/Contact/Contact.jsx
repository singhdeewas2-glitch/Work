import React from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import { useConfig } from '../../context/ConfigContext';
import './Contact.css';
const getEmbedUrl = (input) => {
  if (!input) return null;
  const trimmed = input.trim();

  // 1. If user pastes an iframe, extract the src
  const iframeMatch = trimmed.match(/<iframe.*?src=["'](.*?)["']/);
  if (iframeMatch) return iframeMatch[1];

  // 2. Already an embed URL
  if (trimmed.includes('maps/embed') || trimmed.includes('output=embed')) {
    return trimmed;
  }
  
  // 3. Extract precise CID (Place ID) from complex Google Maps URLs
  // The !1s sequence holds perfectly isolated entity identities
  const dataCidMatch = trimmed.match(/!1s(?:0x[0-9a-f]+:)?(0x[0-9a-f]+)/i);
  if (dataCidMatch) {
     try {
       // Convert hexadecimal Google Place CID to strict Decimal format for the embed payload!
       const cid = BigInt(dataCidMatch[1]).toString();
       return `https://maps.google.com/maps?cid=${cid}&z=15&output=embed`;
     } catch (e) {
       console.error("CID conversion failed", e);
     }
  }

  // 4. Extract Place Name from long Google Maps URLs
  const placeMatch = trimmed.match(/\/maps\/(?:place|search|dir)\/([^/@?]+)/);
  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`;
  }

  // 5. Coordinates explicitly via @lat,lng in a long URL
  const coordMatch = trimmed.match(/@([-\d.]+),([-\d.]+)/);
  if (coordMatch && trimmed.startsWith('http')) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=15&output=embed`;
  }

  // 6. Final fallback: Shortlinks, custom Google links, or raw Address search texts
  return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&z=15&output=embed`;
};
const Contact = () => {
  const { config } = useConfig();
  const address = config?.address || '';
  const phone = config?.phone || '';
  const email = config?.email || '';
  const mapLink = config?.mapsLink || '';
  const embedUrl = getEmbedUrl(mapLink);

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact <span>Us</span></h1>
          <p>We&apos;d love to hear from you. Get in touch today.</p>
        </div>
      </div>

      <div className="contact-body">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Choose your preferred way to contact us:</p>

              <div className="contact-buttons">
                <WhatsAppButton />
                <CallButton />
                <a href={`mailto:${email}`} className="btn btn-outline">
                  Email Us
                </a>
              </div>

              <div className="contact-details">
                <h3>Our Information</h3>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Address:</strong> {address}</p>
              </div>
            </div>

            <div className="contact-map">
              <h2>Find Us</h2>
              <div className="map-container">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Gym Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
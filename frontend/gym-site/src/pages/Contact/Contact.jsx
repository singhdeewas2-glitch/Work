import React from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import { useConfig } from '../../context/ConfigContext';
import './Contact.css';
const getEmbedUrl = (input) => {
  if (!input) return null;

  // Already embed URL — use directly
  if (input.includes('maps/embed')) return input;

  // Extract place name and coordinates from standard Google Maps URL
  const coordMatch = input.match(/@([-\d.]+),([-\d.]+)/);
  const placeMatch = input.match(/\/maps\/place\/([^/@]+)/);

  if (coordMatch && placeMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&ll=${lat},${lng}&z=17&output=embed`;
  }

  if (coordMatch) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=17&output=embed`;
  }

  return null;
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
                {embedUrl ? (
                  <>
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Gym Location"
                    ></iframe>
                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                      <a href={mapLink} target="_blank" rel="noopener noreferrer"
                        style={{ background: '#e53935', color: '#fff', padding: '10px 20px',
                          textDecoration: 'none', display: 'inline-block', borderRadius: '8px' }}>
                        Open in Google Maps
                      </a>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '450px', backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
                    <a href={mapLink} target="_blank" rel="noopener noreferrer"
                      style={{ background: '#e53935', color: '#fff', padding: '12px 24px',
                        textDecoration: 'none', borderRadius: '8px' }}>
                      Open in Google Maps
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
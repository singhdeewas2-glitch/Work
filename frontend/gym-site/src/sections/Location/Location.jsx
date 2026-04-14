import React from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import { useConfig } from '../../context/ConfigContext';
import './Location.css';

const getEmbedUrl = (input) => {
  if (!input) return null;

  const coordMatch = input.match(/@([-\d.]+),([-\d.]+)/);
  const placeMatch = input.match(/\/maps\/place\/([^/@?]+)/);

  if (placeMatch && coordMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&ll=${lat},${lng}&z=17&output=embed`;
  }

  if (coordMatch) {
    return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=17&output=embed`;
  }

  return null;
};

/* Address, hours, map embed */
const Location = () => {
  const { config } = useConfig();
  const address = config?.address || '';
  const mapLink = config?.mapsLink || '';
  const embedUrl = getEmbedUrl(mapLink);

  return (
    <section className="location-block" id="contact">
      <div className="container">
        <h2 className="section-title">Visit or <span>Contact Us</span></h2>
        <p className="location-intro">We&apos;re here to help you start your fitness journey.</p>

        <div className="location-card">
          <div className="location-card-body">
            <div className="location-cta-row">
              <WhatsAppButton message="Hello, I want to visit your gym. Please share details." />
              <CallButton children="Call Us Now" />
            </div>

            <div className="location-details">
              <div className="location-detail-block">
                <h4>Address</h4>
                <p>{address}</p>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-maps-link"
                >
                  Open in Google Maps
                </a>
              </div>
              <div className="location-detail-block">
                <h4>Business Hours</h4>
                <p>Mon - Sat: 6:00 AM - 10:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          <div className="location-map-frame">
            {embedUrl ? (
              <>
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Gym Location Maps"
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', minHeight: '300px', backgroundColor: '#1a1a1a', borderRadius: '12px' }}>
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
    </section>
  );
};

export default Location;

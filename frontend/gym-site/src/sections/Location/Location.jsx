import React from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import { useConfig } from '../../context/ConfigContext';
import './Location.css';

/* Address, hours, map embed */
const Location = () => {
  const { config } = useConfig();
  const address = config?.address || '';
  const mapLink = config?.mapsLink || '';

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
            <iframe
              src={mapLink}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Gym Location Maps"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;

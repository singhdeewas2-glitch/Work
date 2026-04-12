import React from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import { contactConfig, getMapEmbedUrl, getMapLink } from '../../contact/WhatsApp';
import './Location.css';

/* Address, hours, map embed */
const Location = () => {
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
                <p>{contactConfig.location.address}</p>
                <a
                  href={getMapLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-maps-link"
                >
                  Open in Google Maps
                </a>
              </div>
              <div className="location-detail-block">
                <h4>Business Hours</h4>
                <p>{contactConfig.hours.weekdays}</p>
                <p>{contactConfig.hours.weekends}</p>
              </div>
            </div>
          </div>

          <div className="location-map-frame">
            <iframe
              src={getMapEmbedUrl()}
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

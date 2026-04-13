import React from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import { useConfig } from '../../context/ConfigContext';
import './Contact.css';

/* Contact page with WhatsApp, Call, Email, Map */
const Contact = () => {
  const { config } = useConfig();
  const address = config?.address || '';
  const phone = config?.phone || '';
  const email = config?.email || '';
  const mapLink = config?.mapsLink || '';

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
                  src={mapLink}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Gym Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';
import Location from '../components/Location';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>Contact <span>Us</span></h1>
          <p>We'd love to hear from you. Get in touch today.</p>
        </div>
      </div>
      
      {/* Reusing the detailed Location/Contact component here */}
      <div className="contact-details">
        <Location />
      </div>
    </div>
  );
};

export default Contact;

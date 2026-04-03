import React from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import './Location.css';

const Location = () => {
  return (
    <section className="location-section" id="contact">
      <div className="container">
        <h2 className="section-title">Visit or <span>Contact Us</span></h2>
        <p className="location-subtitle">We're here to help you start your fitness journey.</p>
        
        <div className="location-card">
          <div className="location-content">
            <div className="contact-actions">
              <a 
                href="https://wa.me/919907076074" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="saas-btn whatsapp-btn"
              >
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </a>
              <a 
                href="tel:+919907076074" 
                className="saas-btn call-btn"
              >
                <FaPhoneAlt size={16} /> Call Us Now
              </a>
            </div>

            <div className="business-info">
              <div className="info-block">
                <h4>Address</h4>
                <p>123 Fitness Street, Muscle City, NY 10001</p>
              </div>
              <div className="info-block">
                <h4>Business Hours</h4>
                <p>Mon - Fri: 5:00 AM - 11:00 PM</p>
                <p>Sat - Sun: 7:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="location-map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1839486333246!2d-73.98773128459418!3d40.75797467932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1621287684033!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              title="Gym Location Maps"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;

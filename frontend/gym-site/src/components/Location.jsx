import React, { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaClock } from 'react-icons/fa';
import './Location.css';

const Location = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="location-section" id="contact" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">Find <span>Us</span></h2>
        
        <div className="location-grid">
          <div className="location-info reveal">
            <h3>Contact Information</h3>
            <p className="info-desc">Feel free to reach out or visit us during our working hours.</p>
            
            <ul className="info-list">
              <li>
                <div className="info-icon"><FaMapMarkerAlt /></div>
                <div>
                  <h4>Address</h4>
                  <p>123 Fitness Street, Muscle City, NY 10001</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><FaPhoneAlt /></div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 99070 76074</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><FaWhatsapp /></div>
                <div>
                  <h4>WhatsApp</h4>
                  <p>+91 99070 76074</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><FaClock /></div>
                <div>
                  <h4>Business Hours</h4>
                  <p>Mon - Fri: 5:00 AM - 11:00 PM<br/>Sat - Sun: 7:00 AM - 9:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="location-map reveal" style={{ transitionDelay: '0.2s' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1839486333246!2d-73.98773128459418!3d40.75797467932688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1621287684033!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              title="Gym Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;

import React, { useEffect, useRef } from 'react';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import './CTA.css';

const CTA = () => {
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
      { threshold: 0.3 }
    );

    const elements = sectionRef.current.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="cta-section" ref={sectionRef}>
      <div className="container">
        <div className="cta-content reveal">
          <h2>Start Your <span>Fitness Journey</span> Today</h2>
          <p>Don't wait for tomorrow. Take the first step towards a healthier, stronger you.</p>
          
          <div className="cta-btns">
            <a href="https://wa.me/919907076074?text=Hi%2C%20I%20am%20interested%20in%20joining%20your%20gym.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <FaWhatsapp size={20} /> WhatsApp Us
            </a>
            <a href="tel:+919907076074" className="btn btn-outline">
              <FaPhoneAlt size={18} /> Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

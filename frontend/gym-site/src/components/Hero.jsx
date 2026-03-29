import React from 'react';
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-glow"></div>
      <div className="hero-pattern"></div>
      
      <div className="container hero-content">
        <h1 className="hero-title">
          Transform<br />Your Body in<br /><span>90 Days</span>
        </h1>
        <p className="hero-subtitle">
          Join the best fitness gym near you<br />with expert trainers and real results
        </p>
        
        <div className="hero-btns">
          <a href="https://wa.me/919907076074?text=Hi%2C%20I%20am%20interested%20in%20joining%20your%20gym.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="btn btn-primary hero-btn">
            <FaWhatsapp size={20} /> Join Now on WhatsApp
          </a>
          <a href="#plans" className="btn btn-outline hero-btn">
            View Plans
          </a>
        </div>

        <div className="hero-rating">
          <div className="stars">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
          <p>Rated 4.8 by 200+ members</p>
        </div>
      </div>
      
      <a href="#transformations" className="scroll-hint">
        See Transformations
        <div className="scroll-arrow">↓</div>
      </a>
    </section>
  );
};

export default Hero;

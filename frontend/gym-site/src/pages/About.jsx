import React from 'react';
import aboutImg from '../assets/gym15.jpg';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About <span>Us</span></h1>
          <p>Learn more about our mission and facility.</p>
        </div>
      </div>
      
      <div className="container about-content">
        <div className="about-grid">
          <div className="about-text reveal active">
            <h2>Our <span>Story</span></h2>
            <p>GYMFIT was founded with one simple goal: to provide a high-quality, inclusive fitness space for everyone from beginners to advanced athletes. Over the past 5 years, we have grown from a small local gym into a community-driven fitness hub.</p>
            <p>We pride ourselves on having state-of-the-art equipment, exceptionally clean facilities, and trainers who truly care about your success. Whether you want to lose weight, build muscle, or improve your overall health, we're here to help you every step of the way.</p>
          </div>
          
          <div className="about-image reveal active">
            <img src={aboutImg} alt="Gym owners" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

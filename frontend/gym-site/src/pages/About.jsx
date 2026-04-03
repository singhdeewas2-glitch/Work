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
            <h2>Our <span>Mission</span> & Story</h2>
            <p><strong>Our Mission:</strong> To empower individuals of all fitness levels to achieve their goals in a supportive, high-energy environment.</p>
            <p>GYMFIT was founded with one simple goal: to provide a high-quality, inclusive fitness space for everyone from beginners to advanced athletes. Over the past 5 years, we have grown from a small local gym into a community-driven fitness hub.</p>
            <p>We pride ourselves on having state-of-the-art equipment, exceptionally clean facilities, and trainers who truly care about your success.</p>
          </div>
          
          <div className="about-image reveal active">
            <img src={aboutImg} alt="Gym Activity" />
          </div>
        </div>

        <div className="trainers-section" style={{ marginTop: '80px', textAlign: 'center' }}>
          <h2 className="section-title reveal active">Meet Our <span>Trainers</span></h2>
          <div className="stories-grid"> {/* Reusing grid from success stories for trainers */}
            <div className="story-card reveal active" style={{ padding: '30px' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#333', margin: '0 auto 20px' }}></div>
              <h3 style={{color: '#fff', marginBottom:'10px'}}>Mark Johnson</h3>
              <p style={{color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '15px'}}>Head Coach</p>
              <p style={{color: '#aaa', fontSize: '0.9rem'}}>10+ years experience specializing in strength training and bodybuilding.</p>
            </div>
            <div className="story-card reveal active" style={{ padding: '30px' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#333', margin: '0 auto 20px' }}></div>
              <h3 style={{color: '#fff', marginBottom:'10px'}}>Elena Rodriguez</h3>
              <p style={{color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '15px'}}>Yoga & Mobility Specialist</p>
              <p style={{color: '#aaa', fontSize: '0.9rem'}}>Passionate about holistic health, flexibility, and core strengthening.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

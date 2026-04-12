import React from 'react';
import aboutImg from '../../assets/gym15.jpg';

/* Static about + sample trainer cards */
const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>About <span>Us</span></h1>
          <p>Learn more about our mission and facility.</p>
        </div>
      </div>

      <div className="about-inner">
        <div className="about-grid">
          <div className="about-story reveal active">
            <h2>Our <span>Mission</span> &amp; Story</h2>
            <p><strong>Our Mission:</strong> To empower individuals of all fitness levels to achieve their goals in a supportive, high-energy environment.</p>
            <p>GYMFIT was founded with one simple goal: to provide a high-quality, inclusive fitness space for everyone from beginners to advanced athletes. Over the past 5 years, we have grown from a small local gym into a community-driven fitness hub.</p>
            <p>We pride ourselves on having state-of-the-art equipment, exceptionally clean facilities, and trainers who truly care about your success.</p>
          </div>

          <div className="about-image reveal active">
            <img src={aboutImg} alt="Gym Activity" />
          </div>
        </div>

        <div className="about-trainers-block">
          <h2 className="about-trainers-heading reveal active">Meet Our <span>Trainers</span></h2>
          <div className="about-trainers-grid">
            <div className="about-trainer-card reveal active">
              <div className="about-trainer-avatar-placeholder" aria-hidden="true" />
              <h3>Mark Johnson</h3>
              <p className="trainer-title">Head Coach</p>
              <p className="trainer-bio">10+ years experience specializing in strength training and bodybuilding.</p>
            </div>
            <div className="about-trainer-card reveal active">
              <div className="about-trainer-avatar-placeholder" aria-hidden="true" />
              <h3>Elena Rodriguez</h3>
              <p className="trainer-title">Yoga &amp; Mobility Specialist</p>
              <p className="trainer-bio">Passionate about holistic health, flexibility, and core strengthening.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

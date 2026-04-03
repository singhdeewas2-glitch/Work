import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section" id="home">
      <div className="hero-bg"></div>
      
      {/* Subtle edge red glows */}
      <div className="hero-left-glow"></div>
      <div className="hero-right-glow"></div>
      
      {/* Softened background overlay for legibility without washing out */}
      <div className="hero-overlay"></div>
      
      <div className="container hero-content">
        <h1 className="hero-title reveal active">
          <span className="hero-title-main">Transform Your Body</span><br />
          <span className="hero-title-small">In</span><br />
          <span className="hero-title-red">90 Days</span>
        </h1>
        
        <p className="hero-subtext reveal active delay-1">
          Join the best fitness program with real results
        </p>

        <div className="hero-actions reveal active delay-2">
          <a href="#contact" className="btn btn-primary slim-btn">Start Free Trial</a>
          <a href="#plans" className="btn btn-outline slim-btn">View Plans</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

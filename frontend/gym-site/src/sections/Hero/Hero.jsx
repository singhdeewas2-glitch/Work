/*
Hero Section Component
Full-width hero section on the home page
Displays main headline, call-to-action buttons, and background effects
Provides primary entry point for user engagement and conversion
*/

import React from 'react';
import './Hero.css';
const Hero = () => {
  return (
    <section className="home-hero-section" id="home">
      <div className="home-hero-background" aria-hidden="true" />
      <div className="home-hero-glow-left" aria-hidden="true" />
      <div className="home-hero-glow-right" aria-hidden="true" />
      <div className="home-hero-overlay" aria-hidden="true" />

      <div className="container home-hero-content">
        <h1 className="home-hero-title reveal active">
          <span className="home-hero-title-main">
            <span>Transform</span> <span>Your Body</span>
          </span>
          <span className="home-hero-title-small">in</span>
          <br className="hide-on-mobile-br" />
          <span className="home-hero-title-accent">90 Days</span>
        </h1>

        <p className="home-hero-subtitle reveal active reveal-delay-1">
          Join the best fitness program with real results
        </p>

        <div className="home-hero-actions reveal active reveal-delay-2">
          <a href="#contact" className="btn btn-primary home-hero-button-slim">Start Free Trial</a>
          <a href="#plans" className="btn btn-outline home-hero-button-slim">View Plans</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;

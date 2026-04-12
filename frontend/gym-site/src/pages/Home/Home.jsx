/*
Home Page Component
Landing page that combines all homepage sections
Displays hero, features, transformations, pricing, and other key sections
Provides comprehensive overview of gym services and offerings
*/

import React from 'react';
import Hero from '../../sections/Hero/Hero';
import Features from '../../sections/Features/Features';
import Transformations from '../Transformations/Transformations';
import Pricing from '../../sections/Pricing/Pricing';
import Gallery from '../../sections/Gallery/Gallery';
import Trainers from '../../sections/Trainers/Trainers';
import Testimonials from '../../sections/Testimonials/Testimonials';
import CTA from '../../sections/CTA/CTA';
import Location from '../../sections/Location/Location';
const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <Transformations />
      <Pricing />
      <Gallery />
      <Trainers />
      <Testimonials />
      <CTA />
      <Location />
    </div>
  );
};

export default Home;

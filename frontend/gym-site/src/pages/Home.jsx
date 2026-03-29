import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Transformations from '../components/Transformations';
import Pricing from '../components/Pricing';
import Gallery from '../components/Gallery';
import Trainers from '../components/Trainers';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import Location from '../components/Location';

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

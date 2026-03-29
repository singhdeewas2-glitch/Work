import React, { useEffect, useRef } from 'react';
import { FaDumbbell, FaUserTie, FaClipboardList, FaTags } from 'react-icons/fa';
import './Features.css';

const featureData = [
  {
    id: 1,
    icon: <FaUserTie size={40} />,
    title: 'Certified Trainers',
    description: 'Work with the best fitness experts to guide you every step of the way.'
  },
  {
    id: 2,
    icon: <FaDumbbell size={40} />,
    title: 'Modern Equipment',
    description: 'Train with high-quality, state-of-the-art machines and free weights.'
  },
  {
    id: 3,
    icon: <FaClipboardList size={40} />,
    title: 'Personalized Plans',
    description: 'Get custom workout and diet plans tailored to your specific goals.'
  },
  {
    id: 4,
    icon: <FaTags size={40} />,
    title: 'Affordable Pricing',
    description: 'Top-tier fitness experience at pocket-friendly subscription rates.'
  }
];

const Features = () => {
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
      { threshold: 0.2 }
    );

    const cards = sectionRef.current.querySelectorAll('.reveal');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section className="features" id="features" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">Why Choose <span>GYMFIT</span>?</h2>
        <div className="features-grid">
          {featureData.map((feature, index) => (
            <div 
              className="feature-card reveal" 
              key={feature.id} 
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

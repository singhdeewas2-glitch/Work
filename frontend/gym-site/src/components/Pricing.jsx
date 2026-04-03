import React from 'react';
import { FaCheck } from 'react-icons/fa';
import Carousel from './Carousel';
import './Pricing.css';

const pricingData = [
  {
    id: 1, title: 'Monthly Plan', price: '$49', duration: '/month',
    features: ['Access to all gym equipment', 'Locker access', 'Free WiFi', '1 Group Class/month'],
    isPopular: false
  },
  {
    id: 2, title: 'Quarterly Plan', price: '$129', duration: '/3 months',
    features: ['Access to all gym equipment', 'Locker access', 'Free WiFi', 'Unlimited Classes', '1 Personal Training'],
    isPopular: true
  },
  {
    id: 3, title: 'Personal Training', price: '$199', duration: '/month',
    features: ['1-on-1 Expert Coach', 'Custom Diet Plan', 'Bi-weekly check-ins', 'Priority Support', 'Full Access'],
    isPopular: false
  }
];

const getWhatsAppUrl = (title) => `https://wa.me/919907076074?text=${encodeURIComponent(`Hi, I am interested in the ${title}. Please share details.`)}`;

const Pricing = () => {
  return (
    <section className="pricing" id="plans">
      <div className="container">
        <h2 className="section-title">Choose Your <span>Plan</span></h2>
        
        <Carousel 
          items={pricingData} 
          renderItem={(plan) => (
            <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}>
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              
              <div className="pricing-header">
                <h3>{plan.title}</h3>
                <div className="price">
                  <span className="amount">{plan.price}</span>
                  <span className="duration">{plan.duration}</span>
                </div>
              </div>
              
              <ul className="pricing-features">
                {plan.features.map((feature, i) => (
                  <li key={i}><FaCheck className="check-icon" /> {feature}</li>
                ))}
              </ul>
              
              <a href={getWhatsAppUrl(plan.title)} target="_blank" rel="noopener noreferrer" 
                 className={`saas-btn ${plan.isPopular ? 'saas-btn-primary' : 'saas-btn-outline'}`}>
                Join Now
              </a>
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default Pricing;

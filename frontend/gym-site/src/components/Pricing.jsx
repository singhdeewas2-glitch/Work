import React, { useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import './Pricing.css';

const pricingData = [
  {
    id: 1,
    title: 'Monthly Plan',
    price: '$49',
    duration: '/month',
    features: ['Access to all gym equipment', 'Locker access', 'Free WiFi', '1 Group Class/month'],
    isPopular: false
  },
  {
    id: 2,
    title: 'Quarterly Plan',
    price: '$129',
    duration: '/3 months',
    features: ['Access to all gym equipment', 'Locker access', 'Free WiFi', 'Unlimited Group Classes', '1 Personal Training session'],
    isPopular: true
  },
  {
    id: 3,
    title: 'Personal Training',
    price: '$199',
    duration: '/month',
    features: ['1-on-1 Expert Coach', 'Custom Diet Plan', 'Bi-weekly check-ins', 'Priority Support', 'Access to all gym equipment'],
    isPopular: false
  }
];

const getWhatsAppUrl = (title) => {
  let message = 'Hi, I am interested in joining your gym. Please share details.';
  if (title === 'Monthly Plan') {
    message = 'Hi, I want to join the $49 monthly plan. Please share more details.';
  } else if (title === 'Quarterly Plan') {
    message = 'Hi, I am interested in the $129 plan. Please guide me further.';
  } else if (title === 'Personal Training') {
    message = 'Hi, I want personal training with the $199 plan. Please share details.';
  }
  return `https://wa.me/919907076074?text=${encodeURIComponent(message)}`;
};

const Pricing = () => {
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
      { threshold: 0.1 }
    );

    const cards = sectionRef.current.querySelectorAll('.reveal');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, []);

  return (
    <section className="pricing" id="plans" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">Choose Your <span>Plan</span></h2>
        
        <div className="pricing-grid">
          {pricingData.map((plan, index) => (
            <div 
              className={`pricing-card reveal ${plan.isPopular ? 'popular' : ''}`}
              key={plan.id}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
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
                  <li key={i}>
                    <FaCheck className="check-icon" /> {feature}
                  </li>
                ))}
              </ul>
              
              <a href={getWhatsAppUrl(plan.title)} target="_blank" rel="noopener noreferrer" className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-outline'} pricing-btn`}>
                Join Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

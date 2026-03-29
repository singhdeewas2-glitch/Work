import React, { useEffect, useRef } from 'react';
import './Trainers.css';

const trainersData = [
  {
    id: 1,
    name: 'Rahul Sharma',
    specialty: 'Strength & Conditioning',
    experience: '8 years experience',
    image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=500',
  },
  {
    id: 2,
    name: 'Ankit Verma',
    specialty: 'Personal Trainer',
    experience: '10 years experience',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=500',
  },
  {
    id: 3,
    name: 'Priya Singh',
    specialty: 'Yoga & Mobility',
    experience: '6 years experience',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=500',
  }
];

const Trainers = () => {
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
    <section className="trainers" id="trainers" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">Meet Our Expert<br/><span>Trainers</span></h2>
        <p className="section-subtitle reveal">Certified professionals dedicated to your success</p>
        
        <div className="trainers-scroll-container">
          {trainersData.map((trainer, index) => (
            <div 
              className="trainer-card reveal" 
              key={trainer.id}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <img className="trainer-img" src={trainer.image} alt={trainer.name} loading="lazy" />
              <div className="trainer-overlay">
                <h3>{trainer.name}</h3>
                <div className="trainer-specialty">{trainer.specialty}</div>
                <div className="trainer-exp">{trainer.experience}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;

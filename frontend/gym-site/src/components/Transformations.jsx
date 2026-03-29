import React, { useEffect, useRef } from 'react';
import './Transformations.css';
import before1 from '../assets/gym 5.webp';
import after1 from '../assets/gym6.avif';
import before2 from '../assets/gym8.avif';
import after2 from '../assets/gym13.avif';
import before3 from '../assets/gym15.jpg';
import after3 from '../assets/gym2.jpg';

const transformationsData = [
  {
    id: 1,
    name: 'Rohit Sharma',
    story: 'Lost 12kg in 3 months and built lean muscle!',
    beforeImg: before1,
    afterImg: after1,
  },
  {
    id: 2,
    name: 'Priya Singh',
    story: 'Incredible fat loss and toning. Completely transformed my energy levels.',
    beforeImg: before2,
    afterImg: after2,
  },
  {
    id: 3,
    name: 'Ankit Verma',
    story: 'Huge muscle gain transformation in just 6 months of heavy lifting.',
    beforeImg: before3,
    afterImg: after3,
  }
];

const Transformations = () => {
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
    <section className="transformations" id="transformations" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">Real Results from <span>Real Members</span></h2>
        
        <div className="trans-grid">
          {transformationsData.map((item, index) => (
            <div 
              className="trans-card reveal" 
              key={item.id}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <div className="trans-image-container">
                <div className="trans-image before">
                  <span className="badge">Before</span>
                  <img src={item.beforeImg} alt={`${item.name} Before`} loading="lazy" />
                </div>
                <div className="trans-image after">
                  <span className="badge badge-primary">After</span>
                  <img src={item.afterImg} alt={`${item.name} After`} loading="lazy" />
                </div>
              </div>
              <div className="trans-info">
                <h3>{item.name}</h3>
                <p>"{item.story}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Transformations;

import React, { useEffect, useRef } from 'react';
import './Transformations.css';

const transformationsData = [
  {
    id: 1,
    name: 'Rohit Sharma',
    story: 'Lost 12kg in 3 months and built lean muscle!',
    beforeImg: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=500&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Priya Singh',
    story: 'Incredible fat loss and toning. Completely transformed my energy levels.',
    beforeImg: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=500&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Ankit Verma',
    story: 'Huge muscle gain transformation in just 6 months of heavy lifting.',
    beforeImg: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=500&auto=format&fit=crop',
    afterImg: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop',
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

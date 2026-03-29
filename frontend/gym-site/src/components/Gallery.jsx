import React, { useEffect, useRef } from 'react';
import img1 from '../assets/gym17.jpg';
import img2 from '../assets/gym equiments.avif';
import img3 from '../assets/gym18.jpg';
import img4 from '../assets/gym3.jpg';
import img5 from '../assets/gym4.jpg';
import img6 from '../assets/gym19.jpg';
import './Gallery.css';

const galleryImages = [
  img1, img2, img3, img4, img5, img6
];

const Gallery = () => {
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

    const images = sectionRef.current.querySelectorAll('.reveal');
    images.forEach((img) => observer.observe(img));

    return () => {
      images.forEach((img) => observer.unobserve(img));
    };
  }, []);

  return (
    <section className="gallery" id="gallery" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">Our <span>Facilities</span></h2>
        <p className="section-subtitle reveal">State-of-the-art equipment and premium facilities</p>
        
        <div className="gallery-grid">
          {galleryImages.map((src, index) => (
            <div 
              className="gallery-item reveal" 
              key={index}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <img src={src} alt={`Gym interior ${index + 1}`} loading="lazy" />
              <div className="gallery-overlay"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

import React, { useEffect, useRef } from 'react';
import './Gallery.css';
import img1 from '../../assets/gym17.jpg';
import img2 from '../../assets/gym equiments.avif';
import img3 from '../../assets/gym18.jpg';
import img4 from '../../assets/gym3.jpg';
import img5 from '../../assets/gym4.jpg';
import img6 from '../../assets/gym19.jpg';

const galleryImages = [
  img1, img2, img3, img4, img5, img6
];

/* Facility photo grid */
const Gallery = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Defensive check for IntersectionObserver support
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser');
      return;
    }

    let observer = null;
    let observedImages = [];

    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        { threshold: 0.1 }
      );
    } catch (error) {
      console.error('Failed to create IntersectionObserver:', error);
      return;
    }

    const images = sectionRef.current?.querySelectorAll('.reveal');
    if (images && observer) {
      observedImages = Array.from(images);
      observedImages.forEach((img) => observer.observe(img));
    }

    return () => {
      // Safe cleanup with defensive checks
      if (observer && observedImages.length > 0) {
        try {
          observedImages.forEach((img) => {
            if (observer && img) {
              observer.unobserve(img);
            }
          });
        } catch (error) {
          console.error('Error during IntersectionObserver cleanup:', error);
        }
      }
    };
  }, []);

  return (
    <section className="gallery-section" id="gallery" ref={sectionRef}>
      <div className="container">
        <h2 className="gallery-heading reveal">Our <span>Facilities</span></h2>
        <p className="gallery-intro reveal">State-of-the-art equipment and premium facilities</p>

        <div className="gallery-grid">
          {galleryImages.map((src, index) => (
            <div
              className="gallery-item reveal"
              key={index}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <img src={src} alt={`Gym interior ${index + 1}`} loading="lazy" />
              <div className="gallery-item-overlay" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;

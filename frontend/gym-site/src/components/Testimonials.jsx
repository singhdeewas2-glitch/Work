import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Testimonials.css';

const reviewsData = [
  {
    id: 1,
    name: 'Rohit Gupta',
    rating: 5,
    text: 'Amazing gym with great trainers. I saw real results in just 2 months.',
    
  },
  {
    id: 2,
    name: 'Sneha Patel',
    rating: 5,
    text: 'Very supportive environment and professional coaching. My fav gym ever.',
  },
  {
    id: 3,
    name: 'Aman Yadav',
    rating: 5,
    text: 'Best gym in the area. Equipment and trainers are top class.',
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
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

    const title = sectionRef.current.querySelector('.reveal');
    if (title) observer.observe(title);

    return () => {
      if (title) observer.unobserve(title);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviewsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviewsData.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="testimonials" id="reviews" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title reveal">What Our Members <span>Say</span></h2>
        
        <div className="testimonial-slider">
          <button className="slider-btn prev" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          
          <div className="testimonial-content">
            <div className="quote-mark">"</div>
            <p className="testimonial-text">{reviewsData[currentIndex].text}</p>
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < reviewsData[currentIndex].rating ? 'star active' : 'star'} 
                />
              ))}
            </div>
            <h4 className="testimonial-name">- {reviewsData[currentIndex].name}</h4>
          </div>

          <button className="slider-btn next" onClick={nextSlide}>
            <FaChevronRight />
          </button>
        </div>
        
        <div className="slider-dots">
          {reviewsData.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

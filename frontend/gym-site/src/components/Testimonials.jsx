import React from 'react';
import { FaStar } from 'react-icons/fa';
import Carousel from './Carousel';
import './Testimonials.css';

const reviewsData = [
  { id: 1, name: 'Rohit Gupta', rating: 5, text: 'Amazing gym with great trainers. I saw real results in just 2 months.' },
  { id: 2, name: 'Sneha Patel', rating: 5, text: 'Very supportive environment and professional coaching. My fav gym ever.' },
  { id: 3, name: 'Aman Yadav', rating: 5, text: 'Best gym in the area. Equipment and trainers are top class.' }
];

const Testimonials = () => {
  return (
    <section className="testimonials" id="reviews">
      <div className="container">
        <h2 className="section-title">What Our Members <span>Say</span></h2>
        
        <Carousel 
          items={reviewsData}
          renderItem={(review) => (
            <div className="testimonial-card">
              <div className="quote-mark">"</div>
              <p className="testimonial-text">{review.text}</p>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? 'star active' : 'star'} />
                ))}
              </div>
              <h4 className="testimonial-name">- {review.name}</h4>
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default Testimonials;

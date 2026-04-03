import React from 'react';
import Carousel from './Carousel';
import './Trainers.css';

import img1 from '../assets/gym14.avif';
import img2 from '../assets/gym12.avif';
import img3 from '../assets/gym 9.avif';

const trainersData = [
  { id: 1, name: 'Rahul Sharma', specialty: 'Strength & Conditioning', experience: '8 years exp', image: img1 },
  { id: 2, name: 'Ankit Verma', specialty: 'Personal Trainer', experience: '10 years exp', image: img2 },
  { id: 3, name: 'Priya Singh', specialty: 'Yoga & Mobility', experience: '6 years exp', image: img3 }
];

const Trainers = () => {
  return (
    <section className="trainers" id="trainers">
      <div className="container">
        <h2 className="section-title">Meet Our Expert<br/><span>Trainers</span></h2>
        <p className="trainers-subtitle">Certified professionals dedicated to your success</p>
        
        <Carousel 
          items={trainersData}
          renderItem={(trainer) => (
            <div className="trainer-card">
              <img className="trainer-img" src={trainer.image} alt={trainer.name} loading="lazy" />
              <div className="trainer-overlay">
                <h3>{trainer.name}</h3>
                <div className="trainer-specialty">{trainer.specialty}</div>
                <div className="trainer-exp">{trainer.experience}</div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default Trainers;

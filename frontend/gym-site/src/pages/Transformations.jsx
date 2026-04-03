import React from 'react';
import './Transformations.css';

import before1 from '../assets/gym13.2.jpg';
import after1 from '../assets/gym13.1.jpg';
import before2 from '../assets/gym15.1.jpg';
import after2 from '../assets/gym15.jpg';
import before3 from '../assets/gym16.jpg';
import after3 from '../assets/gym16.1.jpg';

const transformationsData = [
  { id: 1, name: 'Manish Paul', story: 'Lost 12kg in 3 months and built lean muscle!', beforeImg: before1, afterImg: after1 },
  { id: 2, name: 'Prashant Singh', story: 'Huge muscle gain transformation. Completely transformed my energy levels.', beforeImg: before2, afterImg: after2 },
  { id: 3, name: 'Ankit Verma', story: 'Huge muscle gain transformation in just 6 months of heavy lifting.', beforeImg: before3, afterImg: after3 }
];

const Transformations = () => {
  return (
    <section className="transformations-section" id="transformations">
      <div className="container">
        <h2 className="trans-section-title">
          REAL RESULTS FROM <span className="text-red">REAL MEMBERS</span>
        </h2>
        
        <div className="trans-grid">
          {transformationsData.map((item) => (
            <div key={item.id} className="trans-card">
              <div className="trans-image-split">
                
                {/* Before Image */}
                <div className="trans-img-wrapper">
                  <span className="trans-badge-dark">Before</span>
                  <img src={item.beforeImg} alt={`${item.name} Before`} loading="lazy" />
                </div>
                
                {/* After Image */}
                <div className="trans-img-wrapper">
                  <span className="trans-badge-red">After</span>
                  <img src={item.afterImg} alt={`${item.name} After`} loading="lazy" />
                </div>

              </div>
              <div className="trans-card-content">
                <h3 className="trans-name">{item.name}</h3>
                <p className="trans-quote">"{item.story}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Transformations;

import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Carousel.css';

const Carousel = ({ items, renderItem, autoWidth = false }) => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
    setActiveIndex(newIndex);
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="carousel-wrapper">
      <button 
        className="carousel-arrow prev" 
        onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
        disabled={activeIndex === 0}
      >
        <FaChevronLeft />
      </button>
      
      <div className="carousel-track" ref={scrollRef} onScroll={handleScroll}>
        {items.map((item, index) => (
          <div className={`carousel-slide ${autoWidth ? 'auto-width' : ''}`} key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <button 
        className="carousel-arrow next" 
        onClick={() => scrollToIndex(Math.min(activeIndex + 1, items.length - 1))}
        disabled={activeIndex === items.length - 1}
      >
        <FaChevronRight />
      </button>

      <div className="carousel-dots-container">
        {items.map((_, index) => (
          <button 
            key={index} 
            className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

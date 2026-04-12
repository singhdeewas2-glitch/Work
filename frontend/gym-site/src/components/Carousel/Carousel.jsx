import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/* Horizontal carousel with arrows and dots */
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
    <div className="carousel">
      <button
        type="button"
        className="carousel-arrow carousel-arrow--prev"
        onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
        disabled={activeIndex === 0}
        aria-label="Previous slide"
      >
        <FaChevronLeft />
      </button>

      <div className="carousel-track" ref={scrollRef} onScroll={handleScroll}>
        {items.map((item, index) => (
          <div
            className={`carousel-slide${autoWidth ? ' carousel-slide--auto' : ''}`}
            key={index}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-arrow carousel-arrow--next"
        onClick={() => scrollToIndex(Math.min(activeIndex + 1, items.length - 1))}
        disabled={activeIndex === items.length - 1}
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>

      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`carousel-dot${index === activeIndex ? ' active' : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;

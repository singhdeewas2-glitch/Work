import React, { useEffect, useRef } from 'react';
import { WhatsAppButton, CallButton } from '../../components/UI/ContactButtons';
import './CTA.css';

/* Call-to-action before footer */
const CTA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    // Defensive check for IntersectionObserver support
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('IntersectionObserver is not supported in this browser');
      return;
    }

    let observer = null;
    let observedElements = [];

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

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    if (elements && observer) {
      observedElements = Array.from(elements);
      observedElements.forEach((el) => observer.observe(el));
    }

    return () => {
      // Safe cleanup with defensive checks
      if (observer && observedElements.length > 0) {
        try {
          observedElements.forEach((el) => {
            if (observer && el) {
              observer.unobserve(el);
            }
          });
        } catch (error) {
          console.error('Error during IntersectionObserver cleanup:', error);
        }
      }
    };
  }, []);

  return (
    <section className="cta-banner" ref={sectionRef}>
      <div className="container">
        <div className="cta-inner reveal">
          <h2>Start Your <span>Fitness Journey</span> Today</h2>
          <p>Don&apos;t wait for tomorrow. Take the first step towards a healthier, stronger you.</p>

          <div className="cta-actions">
            <WhatsAppButton />
            <CallButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

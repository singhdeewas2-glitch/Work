import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col about-col">
            <Link to="/" className="footer-logo">GYM<span>FIT</span></Link>
            <p>Your ultimate fitness destination. We provide world-class facilities and expert guidance to help you achieve your goals.</p>
            <div className="social-links">
              <a href="#" className="instagram"><FaInstagram /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>
          
          <div className="footer-col links-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/#home">Home</a></li>
              <li><a href="/#plans">Plans & Pricing</a></li>
              <li><a href="/#transformations">Success Stories</a></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-col hours-col">
            <h3>Working Hours</h3>
            <ul>
              <li><span>Monday - Friday:</span> 5:00 AM - 11:00 PM</li>
              <li><span>Saturday:</span> 7:00 AM - 9:00 PM</li>
              <li><span>Sunday:</span> 7:00 AM - 9:00 PM</li>
            </ul>
          </div>
          
          <div className="footer-col contact-col">
            <h3>Contact Info</h3>
            <ul className="contact-list">
              <li><FaMapMarkerAlt className="icon" /> 123 Fitness Street, NY</li>
              <li><FaPhoneAlt className="icon" /> +91 83890 44375</li>
              <li><FaEnvelope className="icon" /> support@gymfit.com</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GYMFIT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

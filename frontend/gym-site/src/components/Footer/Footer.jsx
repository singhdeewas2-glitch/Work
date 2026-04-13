import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { WhatsAppButton, CallButton } from '../UI/ContactButtons';
import { useConfig } from '../../context/ConfigContext';

/* Site footer: brand, links, hours, contact */
const Footer = () => {
  const { config } = useConfig();
  const address = config?.address || '';
  const phone = config?.phone || '';
  const email = config?.email || '';
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column footer-about">
            <Link to="/" className="footer-brand">GYM<span>FIT</span></Link>
            <p>Your ultimate fitness destination. We provide world-class facilities and expert guidance to help you achieve your goals.</p>
            <div className="footer-social">
              <a href="#" className="footer-social-instagram" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          <div className="footer-column footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/#home">Home</a></li>
              <li><a href="/#plans">Plans & Pricing</a></li>
              <li><a href="/#transformations">Success Stories</a></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-column footer-hours">
            <h3>Working Hours</h3>
            <ul>
              <li><span>Mon - Sat: 6:00 AM - 10:00 PM</span></li>
              <li><span>Sunday: Closed</span></li>
            </ul>
          </div>

          <div className="footer-column footer-contact">
            <h3>Contact Info</h3>
            <ul className="footer-contact-list">
              <li><FaMapMarkerAlt className="footer-contact-icon" /> {address}</li>
              <li><CallButton children={<><FaPhoneAlt className="footer-contact-icon" /> {phone}</>} /></li>
              <li><a href={`mailto:${email}`}><FaEnvelope className="footer-contact-icon" /> {email}</a></li>
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

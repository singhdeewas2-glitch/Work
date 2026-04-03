import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    if (location.pathname !== '/') {
      e.preventDefault();
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={() => window.scrollTo(0,0)}>
          GYM<span>FIT</span>
        </Link>
        
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={() => { window.scrollTo(0,0); setIsOpen(false); }}>Home</Link>
          </li>
          <li>
            <a href="#plans" onClick={(e) => handleNavClick(e, 'plans')}>Plans</a>
          </li>
          <li>
            <Link to="/success-stories" onClick={() => setIsOpen(false)}>Transformations</Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          </li>
          {user ? (
            <li>
              <Link to="/profile" className="btn btn-outline nav-btn" style={{padding: '10px 20px'}} onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn btn-outline nav-btn" style={{padding: '10px 20px'}} onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          )}
          <li>
            <a href="https://wa.me/919907076074?text=Hi%2C%20I%20am%20interested%20in%20joining%20your%20gym.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="btn btn-primary nav-btn">
              Join Now
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

/*
Navbar Component
Top navigation bar with logo, menu links, and authentication buttons
Handles mobile responsive menu and scroll-based styling changes
Provides access to login, signup, and admin dashboard for authenticated users
*/

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
const Navbar = () => {
  const { user, dbUser } = useAuth();
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
    <nav className={`site-navbar ${scrolled ? 'site-navbar--scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="site-logo" onClick={() => window.scrollTo(0, 0)}>
          GYM<span>FIT</span>
        </Link>

        <div className="nav-menu-toggle" onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>

        <ul className={`nav-menu ${isOpen ? 'nav-menu--open' : ''}`}>
          <li>
            <Link to="/" onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }}>Home</Link>
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
            <>
              <li>
                <Link to="/diet-plan" onClick={() => setIsOpen(false)}>Diet Plan</Link>
              </li>
              {dbUser?.role === 'admin' && (
                <li>
                  <Link to="/admin" className="btn btn-outline nav-cta-button" onClick={() => setIsOpen(false)}>
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link to="/profile" className="btn btn-outline nav-cta-button" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn btn-outline nav-cta-button" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

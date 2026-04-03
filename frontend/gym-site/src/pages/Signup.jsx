import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  // Real-time validation
  useEffect(() => {
    if (!email) {
      setEmailError('');
    } else if (!email.endsWith('@gmail.com') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email must be a valid @gmail.com address');
    } else {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (!password) {
      setPasswordError('');
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (!/(?=.*[a-z])/.test(password)) {
      setPasswordError('Password must contain at least 1 lowercase letter');
    } else if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError('Password must contain at least 1 uppercase letter');
    } else if (!/(?=.*\d)/.test(password)) {
      setPasswordError('Password must contain at least 1 number');
    } else if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setPasswordError('Password must contain at least 1 special character (!@#$%^&*)');
    } else {
      setPasswordError('');
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  }, [confirmPassword, password]);

  const isFormValid = name && email && password && confirmPassword && !emailError && !passwordError && !confirmPasswordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!isFormValid) {
      return setError('Please resolve all validation errors');
    }
    
    setLoading(true);
    try {
      await signup(email, password, name);
      setSuccess('Signup successful! Please check your email to verify your account before logging in.');
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.message || 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card reveal active">
        <h2>Join <span>GYMFIT</span></h2>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter your full name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
            />
            {emailError && <span style={{color: '#ff4444', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>{emailError}</span>}
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Create a password"
            />
            {passwordError && <span style={{color: '#ff4444', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>{passwordError}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="Confirm your password"
            />
            {confirmPasswordError && <span style={{color: '#ff4444', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>{confirmPasswordError}</span>}
          </div>
          
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading || !isFormValid}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-links">
          <div style={{ color: '#888', marginTop: '10px' }}>
            Already have an account? <Link to="/login" className="auth-link" style={{color: 'var(--primary-color)'}}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

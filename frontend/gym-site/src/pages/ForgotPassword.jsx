import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { forgotPassword, confirmPassword } = useAuth();
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!email) {
      setEmailError('');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (!newPassword) {
      setPasswordError('');
    } else if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (!/(?=.*[a-z])/.test(newPassword)) {
      setPasswordError('Password must contain at least 1 lowercase letter');
    } else if (!/(?=.*[A-Z])/.test(newPassword)) {
      setPasswordError('Password must contain at least 1 uppercase letter');
    } else if (!/(?=.*\d)/.test(newPassword)) {
      setPasswordError('Password must contain at least 1 number');
    } else if (!/(?=.*[!@#$%^&*])/.test(newPassword)) {
      setPasswordError('Password must contain at least 1 special character (!@#$%^&*)');
    } else {
      setPasswordError('');
    }
  }, [newPassword]);

  const isStep1Valid = email && !emailError;
  const isStep2Valid = verificationCode && newPassword && !passwordError;

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await forgotPassword(email);
      setStep(2);
      setSuccess('Verification code sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      await confirmPassword(email, verificationCode, newPassword);
      setSuccess('Password successfully reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card reveal active">
        <h2>Reset <span>Password</span></h2>
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        {step === 1 ? (
          <form className="auth-form" onSubmit={handleRequestCode}>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px' }}>
              Enter your email address to receive a password reset code.
            </p>
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
            
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading || !isStep1Valid}>
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="input-group">
              <label htmlFor="code">Verification Code</label>
              <input 
                type="text" 
                id="code" 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
                required 
                placeholder="Enter the code sent to your email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                placeholder="Create a new password"
              />
              {passwordError && <span style={{color: '#ff4444', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>{passwordError}</span>}
            </div>
            
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading || !isStep2Valid}>
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="auth-links">
          <div style={{ color: '#888', marginTop: '10px' }}>
            Remember your password? <Link to="/login" className="auth-link" style={{color: 'var(--primary-color)'}}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

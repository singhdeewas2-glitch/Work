import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* Member login */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      setEmailError('');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  }, [email]);

  const isFormValid = email && password && !emailError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card reveal active">
        <h2>Member <span>Login</span></h2>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            {emailError && <span className="auth-field-hint">{emailError}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading || !isFormValid}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
          <div className="auth-footer-note">
            Don&apos;t have an account? <Link to="/signup" className="auth-link auth-link--accent">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

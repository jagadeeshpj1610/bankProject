import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/index.css';

const UserSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => email.includes('@gmail.com');
  const validatePassword = (password) => password.length >= 6;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError('Email is required.');
    } else if (!validateEmail(value)) {
      setEmailError('Please enter a valid Gmail address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError('Password is required.');
    } else if (!validatePassword(value)) {
      setPasswordError('Password must be at least 6 characters.');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordMatchError('Passwords do not match.');
    } else {
      setPasswordMatchError('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Name, email, password, and confirm password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(result.error || 'Signup failed.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="signupContainer">
      <h2>User SignUp</h2>
      {error && <p className="errorMessage">{error}</p>}
      <form onSubmit={handleSignup}>
        <label className="formLabel">Name:</label>
        <input
          type="text"
          className="formInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="formLabel">Email:</label>
        <input
          type="email"
          className="formInput"
          value={email}
          onChange={handleEmailChange}
          required
        />
        {emailError && <div className="errorMessage">{emailError}</div>}

        <label className="formLabel">Password:</label>
        <div className="passwordInputContainer">
          <input
            type={showPassword ? "text" : "password"}
            className="formInput"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <span
            className="togglePassword"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
        {passwordError && <div className="errorMessage">{passwordError}</div>}

        <label className="formLabel">Confirm Password:</label>
        <input
          type="password"
          className="formInput"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
        {passwordMatchError && (
          <div className="errorMessage" style={{ textAlign: 'left' }}>
            {passwordMatchError}
          </div>
        )}

        <button type="submit" className="signupButton">Sign Up</button>
      </form>

      <h5>Already have an account? <Link to="/login">Login</Link></h5>
    </div>
  );
};

export default UserSignup;

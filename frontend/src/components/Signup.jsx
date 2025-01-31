import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/index.css';

const UserSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name, !email || !password || !confirmPassword) {
      setError('name, Email, password, and confirm password are required.');
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

      <form onSubmit={handleSignup} className="signupForm">
        <div className="formGroup">
          <h2 className="signupHeading">User SignUp</h2>
          {error && <p className="errorMessage">{error}</p>}
          <label className="formLabel">Name:</label>
          <input
            type='text'
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label className="formLabel">Password:</label>
          <input
            type="password"
            className="formInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label className="formLabel">Confirm Password:</label>
          <input
            type="password"
            className="formInput"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (e.target.value !== password) {
                setPasswordMatchError('Passwords do not match.');
              } else {
                setPasswordMatchError('');
              }
            }}
            required
          />
          {passwordMatchError && <div className="errorMessage" style={{textAlign:"left"}}>{passwordMatchError}</div>}
        </div>
        <button type="submit" className="signupButton">Sign Up</button>
        <h5>Already have an Account? <Link to="/adminlogin">Login</Link></h5>
      </form>
    </div>
  );
};

export default UserSignup;

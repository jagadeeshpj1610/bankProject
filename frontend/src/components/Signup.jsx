import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/index.css';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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
      <h2 className="signupHeading">User Sign Up</h2>
      {error && <div className="errorMessage">{error}</div>}
      <form onSubmit={handleSignup} className="signupForm">
        <div className="formGroup">
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
        <button type="submit" className="signupButton">Sign Up</button>
        <h5>Already have an Account   <Link to = "/adminlogin">Login</Link></h5>
      </form>

    </div>
  );
};

export default UserSignup;

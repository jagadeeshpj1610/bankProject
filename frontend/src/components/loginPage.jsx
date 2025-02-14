import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/index.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return email.includes('gmail.com');
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError('Email is required.');
    } else if (!validateEmail(value)) {
      setEmailError('Enter a valid email...');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError('Password is required.');
    } else if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || emailError || !password || passwordError) {
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();

        localStorage.setItem('token', user.token);
        localStorage.setItem('role', user.user.role);
        localStorage.setItem('email', email);

        if (user.user.role === 'admin') {
          navigate('/home/adminHome');
        } else {
          navigate('/userHome');
        }
      } else {
        const errorData = await response.json();
        setMsg(errorData.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      setMsg('An error occurred, please try again later.');
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h2 className="loginHeading">User Login</h2>

        <form onSubmit={handleLogin} className="userLoginForm">
          {msg && <p className="errorMessage">{msg}</p>}
          <label htmlFor="loginInput">Email:</label>
          <input
            type="email"
            className="loginInput"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
          />
          {emailError && <p className="errorMessage">{emailError}</p>}

          <label htmlFor="passwordInput">Password:</label>
          <input
            type="password"
            className="loginInput"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            required
          />
          {passwordError && <p className="errorMessage">{passwordError}</p>}

          <button type="submit" className="loginButton" disabled = {!email || !password || emailError || passwordError}>Login</button>
          <h5 className="signupLink">If you are new to the application? <Link to="/usersignup">Sign Up</Link></h5>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


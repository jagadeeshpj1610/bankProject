import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import '../css/login.css';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  const navigate = useNavigate();
  const validUsername = 'user@123';
  const validPassword = 'user0987';
  const getUserName = (e) => setUserName(e.target.value);
  const getPassword = (e) => setPassword(e.target.value);
  const checking = () => {
    (!userName || !password) ? setErrorMessage('Both fields are required.') : setErrorMessage('')
    (userName.length <= 8 && userName.length > 0) ? setErrorMessage('Username must be at least 8 characters long.') : setErrorMessage('')
    (password.length < 7) ? setErrorMessage('Password must be at least 7 characters long.') : setErrorMessage('')
    if (userName === validUsername && password === validPassword) {
      navigate('/home');
    } else {
      setAttempts(attempts + 1);
      setErrorMessage(attempts + 1 < 3 ? 'Invalid username or password. Try again.' : '');
      if (attempts + 1 >= 3) {
        navigate('/');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="loginForm">
        <h2>User Login</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <label>Username:</label>
        <input type="text" placeholder="Enter your username" onChange={getUserName} />
        <label>Password:</label>
        <input type="password" placeholder="Enter your password" onChange={getPassword} />
        <button onClick={checking}>Login</button>
      </div>
    </>
  );
};

export default LoginPage;

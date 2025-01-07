import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './header';
import '../css/login.css'

const LoginPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  let user = 'user@123';
  let pass = 'user0987'
  const getUserName = (e) => {
    setUserName(e.target.value)
  }
  const getPassword = (e) => {
    setPassword(e.target.value);
  }
  const checking = () => {
    if(user === userName && pass === password) {
      navigate('/home')
    }
  }
  return (
    <>
    <Header />
    <div className="loginForm">
      <h2>User Login</h2>
      <label>Username:</label>
      <input type="text" placeholder="Enter your username" onChange={getUserName} />
      <label>Password:</label>
      <input type="password" placeholder="Enter your password" onChange={getPassword} />
      <button onClick={checking}>Login</button>
      <Link to="/signup">Create a new account</Link>
    </div>
    </>
  );
};

export default LoginPage;

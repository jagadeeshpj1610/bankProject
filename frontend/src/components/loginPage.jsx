import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header';
import '../css/login.css'

const LoginPage = () => {
  return (
    <>
    <Header />
    <div className="loginForm">
      <h2>User Login</h2>
      <label>Username:</label>
      <input type="text" placeholder="Enter your username" />
      <label>Password:</label>
      <input type="password" placeholder="Enter your password" />
      <button>Login</button>
      <Link to="/signup">Create a new account</Link>
    </div>
    </>
  );
};

export default LoginPage;

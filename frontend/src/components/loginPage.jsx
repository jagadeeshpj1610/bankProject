import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="loginForm">
      <h2>User Login</h2>
      <p>Username:</p>
      <input type="text" placeholder="Enter your username" />
      <p>Password:</p>
      <input type="password" placeholder="Enter your password" />
      <br />
      <button>Login</button>
      <br />
      <Link to="/signup">Create a new account</Link>
    </div>
  );
};

export default LoginPage;

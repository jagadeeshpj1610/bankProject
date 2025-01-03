import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header';

const Signup = () => {
  return (
    <>
    <Header />
    <div className="signupForm">
      <h2>Signup</h2>
      <p>Username:</p>
      <input type="text" placeholder="Enter your username" />
      <p>Email:</p>
      <input type="email" placeholder="Enter your email" />
      <p>Password:</p>
      <input type="password" placeholder="Enter your password" />
      <br />
      <button>Create Account</button>
      <br />
      <Link to="/login">Already have an account? Login here.</Link>
    </div>
    </>
  );
};

export default Signup;

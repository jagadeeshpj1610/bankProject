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
      <p>Password</p>
      <input type="email" placeholder="Enter the password" />
      <p>confirm Password:</p>
      <input type="password" placeholder="confirm the password" />
      <br />
      <br />
      <button>Create Account</button>
      <br />
      <br />
      <Link to="/login">Already have an account? Login here.</Link>
    </div>
    </>
  );
};

export default Signup;

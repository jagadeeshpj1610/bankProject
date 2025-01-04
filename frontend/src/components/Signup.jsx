import React from 'react';
import { Link } from 'react-router-dom';
import Header from './header';
import '../css/login.css'

const Signup = () => {
  return (
    <>
    <Header />
    <div className="signupForm">
      <h2>Signup</h2>
      <label>Username:</label>
      <input type="text" placeholder="Enter your username" />
      <label>Password</label>
      <input type="email" placeholder="Enter the password" />
      <label>Confirm Password:</label>
      <input type="password" placeholder="confirm the password" />
      <button>Create Account</button>
      <Link to="/userlogin">Already have an account? Login here.</Link>
    </div>
    </>
  );
};

export default Signup;

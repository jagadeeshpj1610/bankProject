import React from 'react';
import Header from './header';
const AdminLoginPage = () => {
  return (
    <>
  <Header />
    <div className="loginForm">
      <h2>Admin Login</h2>
      <p>Username:</p>
      <input type="text" placeholder="Enter your username" />
      <p>Password:</p>
      <input type="password" placeholder="Enter your password" />
      <br />
      <button>Login</button>
    </div>
    </>
  );
};

export default AdminLoginPage;

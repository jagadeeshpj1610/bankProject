import React from 'react';
import Header from './header';
const AdminLoginPage = () => {
  return (
    <>
  <Header />
    <div className="loginForm">
      <h2>Admin Login</h2>
      <label>Username:</label>
      <input type="text" placeholder="Enter your username" />
      <label>Password:</label>
      <input type="password" placeholder="Enter your password" />
      <button>Login</button>
    </div>
    </>
  );
};

export default AdminLoginPage;

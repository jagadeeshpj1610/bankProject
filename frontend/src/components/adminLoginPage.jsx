import React from 'react';
import Header from './header';
const AdminLoginPage = () => {
  return (
    <>
  <Header />
    <div className="loginForm" style={{ textAlign: "center", marginTop: "20%" }}>
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

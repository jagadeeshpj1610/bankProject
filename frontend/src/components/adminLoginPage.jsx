import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../css/login.css'

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "admin");

        navigate('/home/adminhome');
      } else {
        setErrMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrMessage("Network error. Please try again later.");
    }
  };

  return (
    <>

      <div className="loginForm">
        <h2>Admin Login</h2>
        {errMessage && <p style={{ color: "red" }}>{errMessage}</p>}
        <form>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={handleAdminLogin}>
            Login
          </button>
          {/* <h5>
            Don't have an account? <Link to="/adminsignup">Sign Up</Link>
          </h5> */}
        </form>
      </div>
    </>
  );
};

export default AdminLoginPage;

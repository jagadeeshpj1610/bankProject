import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './header';
import AdminSignup from './adminSignup';
const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const navigate = useNavigate()

  const handleAdminLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json();
      response.status === 200 ? navigate('/home') : setErrMessage(data.message)
    } catch (error) {
      setErrMessage(data.message)
    }
  }
  return (
    <>
      <Header />
      <div className="loginForm">
        <h2>Admin Login</h2>
        <p style={{color:"red"}}>{errMessage}</p>
        <form>
          <label>Username:</label>
          <input type="text" placeholder="Enter your username" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password:</label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type='button' onClick={handleAdminLogin}>Login</button>
          <h4><Link to={'/adminsignup'}>signup</Link></h4>
        </form>
      </div>
    </>
  );
};

export default AdminLoginPage;

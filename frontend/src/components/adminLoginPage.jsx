
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/login.css';

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError("Email is required.");
    } else if (!value.includes("@gmail.com")) {
      setEmailError("Email must be a Gmail address.");
    } else {
      setEmailError("");
    }
  };


  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!value) {
      setPasswordError("Password is required.");
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleAdminLogin = async () => {
    if (!email || !password || emailError || passwordError) {
      setErrMessage("Please fix the errors before submitting.");
      return;
    }

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
    <div className="loginForm">
      <h2>Admin Login</h2>
      {errMessage && <p style={{ color: "red" }}>{errMessage}</p>}
      <form>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
        />
        {emailError && <p style={{ color: "red", fontSize: "14px" }}>{emailError}</p>}

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePasswordChange}
        />
        {passwordError && <p style={{ color: "red", fontSize: "14px"}}>{passwordError}</p>}

        <button
          type="button"
          onClick={handleAdminLogin}
          disabled={!email || !password || emailError || passwordError}
        >
          Login
        </button>
          {/* <h5>Don't have an account? <Link to="/adminsignup">Sign Up</Link></h5>  */}
      </form>
    </div>
  );
};

export default AdminLoginPage;


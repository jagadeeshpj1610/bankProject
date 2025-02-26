import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError("Email is required.");
    } else if (!validateEmail(value)) {
      setEmailError("Enter a valid email address.");
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
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || emailError || !password || passwordError) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();


      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.isAdmin ? "admin" : "user");
        localStorage.setItem("email", email);

        (data.user.isAdmin) ? navigate("/home/adminhome") : navigate("/userhome");
      } else {
        setMsg(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setMsg("An error occurred, please try again later.");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginContainer">
        <h2 className="loginHeading">Login</h2>

        <form onSubmit={handleLogin} className="userLoginForm">
          {msg && <p className="errorMessage">{msg}</p>}

          <label htmlFor="loginInput">Email:</label>
          <input
            type="email"
            className="loginInput"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
          />
          {emailError && <p className="errorMessage">{emailError}</p>}

          <label htmlFor="passwordInput">Password:</label>
          <div className="passwordInputContainer">
            <input
              type={passwordVisible ? "text" : "password"}
              className="loginInput"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
            />
            <span className="togglePasswordText" onClick={handlePasswordToggle}>
              {passwordVisible ? "Hide" : "Show"}
            </span>
          </div>
          {passwordError && (
            <p className="errorMessage" style={{ padding: "15px" }}>
              {passwordError}
            </p>
          )}

          <button
            type="submit"
            className="loginButton"
            disabled={!email || !password || emailError || passwordError}
          >
            Login
          </button>
          <h5 className="signupLink">
            If you are new to the application? <Link to="/usersignup">Sign Up</Link>
          </h5>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

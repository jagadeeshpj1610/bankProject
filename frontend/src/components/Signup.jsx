import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Index.css";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => email.includes('gmail');
  const validatePassword = (password) => password.length >= 6;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(!value ? "Email is required." : !validateEmail(value) ? "Please enter a valid email." : "");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(!value ? "Password is required." : !validatePassword(value) ? "Password must be at least 6 characters." : "");
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatchError(value !== password ? "Passwords do not match." : "");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      return;
    }

    try {

      //fetch("https://magadhabackend.onrender.com/api/auth/signup"
      //fetch("http://localhost:8000/api/auth/signup"
      const response = await fetch("https://magadhabackend.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(result.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="signupContainer">
      <h2>Sign Up</h2>
      {error && <p className="errorMessage">{error}</p>}
      <form onSubmit={handleSignup}>
        <label className="formLabel">Email:</label>
        <input type="email" className="formInput" value={email} onChange={handleEmailChange} required />
        {emailError && <div className="errorMessage">{emailError}</div>}

        <label className="formLabel">Password:</label>
        <div className="passwordInputContainer">
          <input type={showPassword ? "text" : "password"} className="formInput" value={password} onChange={handlePasswordChange} required />
          <span className="togglePassword" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</span>
        </div>
        {passwordError && <div className="errorMessage">{passwordError}</div>}

        <label className="formLabel">Confirm Password:</label>
        <div className="passwordInputContainer">
          <input type={showConfirmPassword ? "text" : "password"} className="formInput" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          <span className="togglePassword" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "Hide" : "Show"}</span>
        </div>
        {passwordMatchError && <div className="errorMessage">{passwordMatchError}</div>}

        <button type="submit" className="signupButton">Sign Up</button>
      </form>

      <h5>Already have an account? <Link to="/login">Login</Link></h5>
    </div>
  );
};

export default UserSignup;

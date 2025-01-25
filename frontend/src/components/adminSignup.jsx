import React, { useState } from "react";
import '../css/App.css';
import { Link } from "react-router-dom";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Both email and password are required.");
      setSuccess(false);
      return;
    }

    const data = { email, password };
    try {
      const response = await fetch("http://localhost:8000/api/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Signup successful! Please log in.");
        setSuccess(true);
      } else {
        setMessage(result.message || "Signup failed. Please try again.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Network error, please try again later.");
      setSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Admin Signup</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Sign Up</button>
        <h5>
            Already have an account <Link to="/adminLogin">Log in</Link>
          </h5>
      </form>

      {message && (
        <p style={{ color: success ? "green" : "red" }}>{message}</p>
      )}
    </div>
  );
};

export default AdminSignup;

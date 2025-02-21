import React from "react";
import { Link } from "react-router-dom";
import "../css/App.css";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-heading">Welcome to</h1>
        <h1 className="welcome-heading">Magadha Banking</h1>
        <p className="welcome-text">
          Simple, and Smart Banking. Manage your finances with ease.
        </p>
        <Link to="/login" className="welcome-button">Get Started</Link>
      </div>
    </div>
  );
};

export default Welcome;

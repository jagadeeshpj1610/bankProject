import React from "react";
import { Link } from "react-router-dom";
import "../css/App.css";

const Welcome = () => {
  return (
    <div className="welcomeContainer">
      <h1>Welcome to the Magadha Banking</h1>
      <div className="options">
        <p className="admins"> <Link to="/adminLogin" className="link">Employee</Link> </p>
        <p className="user"> <Link to="/login" className="link">Customer</Link></p>
      </div>

    </div>
  );
}

export default Welcome;

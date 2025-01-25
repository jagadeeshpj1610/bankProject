import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import '../css/App.css';

function Welcome() {
  return (
    <div>
      <Header />
      <div className="welcome-container">
        <h1>Welcome to the Bank Application</h1>
        <p>
          <Link to="/adminLogin">Admin</Link> | <Link to="/login">User</Link>
        </p>
      </div>
    </div>
  );
}

export default Welcome;

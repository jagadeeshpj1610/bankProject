import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";

function Welcome() {
  <Header />
  return (
    <div className="welcome-container">
      <h1>Welcome to the Bank Application</h1>
      <p>
        <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Welcome;

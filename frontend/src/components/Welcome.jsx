import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";

const Welcome = () => {
  return (
    <>
      <Header />
      <div>
        <h1>Welcome</h1>
        <p>Please select an option:</p>
        <div>
          <Link to="/login">
            <button>User Login</button>
          </Link>
          <Link to="/adminlogin">
            <button>Admin Login</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Welcome;

import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import '../css/App.css'

const Welcome = () => {
  return (
    <>
      <Header />
      <div className="userLoginDiv">
        <h1>Welcome</h1>
        <p>Please select an option:</p>
        <div>
          <Link to="/login">
            <button>User</button>
          </Link>
          <Link to="/adminlogin">
            <button>Admin</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Welcome;

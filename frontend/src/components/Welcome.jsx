import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header />
    <div>
      <h1>Welcome</h1>
      <p>Please select an option:</p>
      <div>
        <button onClick={() => navigate("/login")}>User Login</button>
        <button onClick={() => navigate("/adminlogin")}>Admin Login</button>
      </div>
    </div>
    </>
  );
};

export default Welcome;

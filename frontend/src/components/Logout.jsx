import React from 'react';
import { Link } from 'react-router-dom';
import '../css/logout.css';

function Logout() {
  return (
    <div className="logout-popup">
      <p className="logout-message">Do you want to exit?</p>
      <div className="logout-buttons">
        <button className="logout-cancel">Cancel</button>
        <button className="logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Logout;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [showPopup, setShowPopup] = useState(true);
  const navigate = useNavigate();

  const handleConfirm = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    sessionStorage.clear();

    navigate("/", { replace: true });
  };

  const handleCancel = () => {

    setShowPopup(false);
    navigate(-1);
  };

  return (
    <>
      {showPopup && (
        <div className="logoutPopup">
          <div className="popupContent">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="popupButtons">
              <button className="confirmButton" onClick={handleConfirm}>Yes, Logout</button>
              <button className="cancelButton" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;

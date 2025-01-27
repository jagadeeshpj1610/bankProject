import React, { useState, useEffect } from 'react';
import '../css/header.css';

const CheckBalance = () => {
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        setError('Email is not provided!');
        setLoading(false);
        return;
      }

      if (!token) {
        setError('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/userDetails?email=${email}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setTimeout(() => {
            setBalance(data.userDetails.balance);
            setLoading(false);
          }, 3000);
        } else {
          setError('Failed to fetch balance.');
          setLoading(false);
        }
      } catch (err) {
        setError('An error occurred while fetching balance.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
  }, [email, token]);

  return (
    <div className="checkBalanceContainer">
      {error && <div className="errorMessage">{error}</div>}
      <h2 className="checkBalanceHeading">Your Current Balance</h2>
      {loading ? (
        <p className="loadingText">Loading balance...</p>
      ) : (
        <div className="balanceDetails">
          {balance !== null ? (
            <p className="balanceText">Balance: {balance}</p>
          ) : (
            <p className="errorText">Failed to load balance.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckBalance;

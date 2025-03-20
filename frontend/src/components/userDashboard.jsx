import React, { useState, useEffect } from 'react';
import '../css/UserHome.css';

const UserHome = () => {
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  const [userDetails, setUserDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        setError('Email is not provided!');
        return;
      }

      if (!token) {
        setError('No token found. Please login.');
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
          setUserDetails(data.userDetails);
          setTransactions(data.transactions || []);
        } else {
          setError(data.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      }
    };

    fetchUserData();
  }, [email, token]);

  const handleCheckBalanceClick = () => {
    setShowPopup(true);
    setIsLoading(true);
    setShowBalance(false);

    setTimeout(() => {
      setIsLoading(false);
      setShowBalance(true);
    }, 3000);
  };

  const closeThePopup = () => {
    setShowPopup(false);
  };


  if (error) {
    return <div className="errorMessage">{error}</div>;
  }

  return (
    <div className="userHomeContainer">
      <h1 className="welcomeMessage">
        Welcome, {userDetails ? userDetails.name : ''}
      </h1>

      <section className="userDetailsSection">
        {userDetails ? (
          <table className="detailsTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>DOB</th>
                <th>Address</th>
                <th>Account No</th>
                <th>Ac.Type</th>
                <th>Phone</th>
                <th>Aadhar</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{userDetails.name}</td>
                <td>{userDetails.email}</td>
                <td>{new Date(userDetails.dob).toDateString()}</td>
                <td>{userDetails.address}</td>
                <td>{userDetails.account_number}</td>
                <td>{userDetails.account_type}</td>
                <td>{userDetails.phone}</td>
                <td>{userDetails.aadhaar}</td>
                <td>{new Date(userDetails.created_at).toDateString()}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading user details...</p>
        )}

        <button onClick={handleCheckBalanceClick} className='checkBalanceBtn'>Check balance</button>
      </section>

      {showPopup && (
        <div className="popupContainer" onClick={closeThePopup}>

          <div className="popup">

            {isLoading ? (
              <div className="spinnerContainer">
                <div className="spinner"></div>
              </div>
            ) : (
              <div className="balanceDetails">
                  <button onClick={closeThePopup} className='closeBtn'>X</button>
                <p style={{ color: "black", fontSize: "1.3rem" }}>Your Current Balance:</p>
                {userDetails.balance !== null ? (
                  <p className="balanceText">Balance: ₹{userDetails.balance}</p>
                ) : (
                  <p className="errorText">Failed to load balance.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="transactionHistorySection">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <table className="transactionsTable">
            <thead>
              <tr>
                <th>Sender Account</th>
                <th>Sender Name</th>
                <th>Receiver Account</th>
                <th>Receiver Name</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.sender_account}</td>
                  <td>{userDetails.name}</td>
                  <td>{transaction.receiver_account}</td>
                  <td>{transaction.receiver_name}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: 'black', textAlign: 'left', padding: '5px', margin: '2px' }}>No transactions found</p>
        )}
      </section>
    </div>
  );
};

export default UserHome;

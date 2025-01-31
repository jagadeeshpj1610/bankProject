import React, { useState, useEffect } from 'react';
import '../css/userHome.css'


const UserHome = () => {
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  const [userDetails, setUserDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

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
          setTransactions(data.transactions);


        } else {
          setError(data.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
      }
    };

    fetchUserData();
  }, [email, token]);

  if (error) {
    return <div className="errorMessage">{error}</div>;
  }

  return (
    <div className="userHomeContainer">
      <h1 className="welcomeMessage">
        Welcome, {userDetails ? userDetails.name : ''}
      </h1>

      <section className="userDetailsSection">
        <h2>User Details</h2>
        {userDetails ? (
          <table className="detailsTable">
            <thead>
              <tr>
                <th>Field</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td>{userDetails.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{userDetails.email}</td>
              </tr>
              <tr>
                <td>Account Number</td>
                <td>{userDetails.account_number}</td>
              </tr>
              <tr>
                <td>Account Type</td>
                <td>{userDetails.account_type}</td>
              </tr>
              <tr>
                <td>Aadhar Number</td>
                <td>{userDetails.aadhaar}</td>
              </tr>
              <tr>
                <td>Created At</td>
                <td>{new Date(userDetails.created_at).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Loading user details...</p>
        )}
      </section>

      <section className="transactionHistorySection">
        <h2>Transaction History</h2>
        {transactions.length > 0 ? (
          <table className="transactionsTable">
            <thead>
              <tr>
                <th>Sender Account</th>
                <th>Sender Name</th>
                <th>Receiver Account</th>
                <th>Sender Name</th>
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
          <p>No transactions found</p>
        )}
      </section>
    </div>
  );
};

export default UserHome;

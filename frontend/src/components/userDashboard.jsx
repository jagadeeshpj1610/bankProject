import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UserHome = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [userDetails, setUserDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        setError('Email is not provided!');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/userDetails?email=${email}`);
        const data = await response.json();
        // console.log(data);

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
  }, [email]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {userDetails.name}</h1>

      <h2>User Details</h2>
      {userDetails ? (
        <table>
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
              <td>Balance</td>
              <td>{userDetails.balance}</td>
            </tr>
            <tr>
              <td>Account Type</td>
              <td>{userDetails.account_type}</td>
            </tr>
            <tr>
              <td>Created At</td>
              <td>{userDetails.created_at}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading user details...</p>
      )}

      <h2>Transaction History</h2>
      {transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Receiver Account</th>
              <th>Sender Account</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.receiver_account}</td>
                <td>{transaction.sender_account}</td>
                <td>{new Date(transaction.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found</p>
      )}
    </div>
  );
};

export default UserHome;

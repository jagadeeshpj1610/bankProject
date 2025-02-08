import React, { useState } from "react";
import '../css/deposit.css';

const Deposit = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [depositDetails, setDepositDetails] = useState(null);

  const fetchAccountDetails = async (accountNumber) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not authenticated. Please log in.");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAccountDetails(data?.userDetails?.[0] || null);
    } catch {
      setAccountDetails(null);
    }
  };

  const handleDeposit = async (event) => {
    event.preventDefault();
    if (!accountNumber || !amount) return setMessage("Account number and amount are required");

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/admin/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ accountNumber, amount }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Deposit successful");
        setDepositDetails(result);
      } else {
        setMessage(result.error || "Failed to deposit");
      }
    } catch {
      setMessage("Network error, please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="depositContainer">
        <h1 className="depositTitle">Deposit</h1>
        <form className="depositForm" onSubmit={handleDeposit}>
          <label htmlFor="">Account Number</label>
          <input
            className="inputField"
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            onBlur={() => fetchAccountDetails(accountNumber)}
            required
          />
          {accountDetails && <p className="confirmName">Account Name: {accountDetails.name}</p>}
          <label htmlFor="">Amount</label>
          <input
            className="inputField"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button className="depositButton" type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Deposit"}
          </button>
        </form>
      </div>

      {message && <p>{message}</p>}

      {depositDetails && (
        <div className="depositDetails">
          <h2>Deposit Details</h2>
          <table className="depositTable">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Account Name</th>
                <th>Previous Balance</th>
                <th>Amount Deposited</th>
                <th>Type</th>
                <th>Total Balance</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{depositDetails.accountNumber}</td>
                <td>{depositDetails.prevBalance?.[0]?.[0]?.name || "N/A"}</td>
                <td>{depositDetails.prevBalance?.[0]?.[0]?.balance || "N/A"}</td>
                <td>{depositDetails.amount}</td>
                <td>{depositDetails.type}</td>
                <td>{depositDetails.mainBalance?.[0]?.[0]?.balance || "N/A"}</td>
                <td>{new Date(depositDetails.timestamp).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Deposit;

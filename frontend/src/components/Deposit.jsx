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
      const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`);
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
      const response = await fetch("http://localhost:8000/api/admin/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          <input
            className="inputField"
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            onBlur={() => fetchAccountDetails(accountNumber)}
            required
          />
          {accountDetails && <p>Account Name: {accountDetails.name}</p>}
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
          <p>Account Number: {depositDetails.accountNumber}</p>
          <p>Account Name: {depositDetails.prevBalance?.[0]?.[0]?.name || "N/A"}</p>
          <p>Previous Balance: {depositDetails.prevBalance?.[0]?.[0]?.balance || "N/A"}</p>
          <p>Amount Deposited: {depositDetails.amount}</p>
          <p>Type: {depositDetails.type}</p>
          <p>Total Balance after Deposit: {depositDetails.mainBalance?.[0]?.[0]?.balance || "N/A"}</p>
          <p>Date & Time: {new Date(depositDetails.timestamp).toLocaleString()}</p>
        </div>
      )}
    </>
  );
};

export default Deposit;

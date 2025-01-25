import React, { useState } from "react";
import '../css/withdraw.css';

const Withdraw = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [withdrawalDetails, setWithdrawalDetails] = useState(null);

  const fetchAccountDetails = async (accountNumber) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`);
      const data = await response.json();
      setAccountDetails(data?.userDetails?.[0] || null);
    } catch {
      setAccountDetails(null);
    }
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();
    if (!accountNumber || !amount) return setMessage("Account number and amount are required");

    setIsProcessing(true);
    try {
      const response = await fetch("http://localhost:8000/api/admin/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, amount }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Withdrawal successful");
        setWithdrawalDetails(result);
      } else {
        setMessage(result.error || "Failed to withdraw");
      }
    } catch {
      setMessage("Network error, please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="withdrawContainer">
        <h1 className="withdrawTitle">Withdraw</h1>
        <form className="withdrawForm" onSubmit={handleWithdraw}>
          <input className="inputField" type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} onBlur={() => fetchAccountDetails(accountNumber)} required />
          {accountDetails && <p>Account Name: {accountDetails.name}</p>}
          <input className="inputField" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <button className="withdrawButton" type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Withdraw"}
          </button>
        </form>
      </div>

      {message && <p>{message}</p>}

      {withdrawalDetails && (
        <div className="withdrawalDetails">
          <h2>Withdrawal Details</h2>
          <p>Account Number: {withdrawalDetails.accountNumber}</p>
          <p>Account Name: {withdrawalDetails.prevBalance[0][0].name}</p>
          <p>Previous Balance: {withdrawalDetails.prevBalance[0][0].balance}</p>
          <p>Amount Withdrawn: {withdrawalDetails.amount}</p>
          <p>Type: {withdrawalDetails.type}</p>
          <p>Total Balance after Withdrawal: {withdrawalDetails.mainBalance[0][0].balance}</p>
          <p>Date & Time: {new Date(withdrawalDetails.timestamp).toLocaleString()}</p>
        </div>
      )}
    </>
  );
};

export default Withdraw;

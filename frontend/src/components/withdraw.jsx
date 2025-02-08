import React, { useState } from "react";
import '../css/withdraw.css'

const Withdraw = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [withdrawalDetails, setWithdrawalDetails] = useState(null);

  const fetchAccountDetails = async (accountNumber) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      });
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
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/admin/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
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
          <button className="withdrawButton" type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Withdraw"}
          </button>
        </form>
      </div>

      {message && <p>{message}</p>}

      {withdrawalDetails && (
        <div className="withdrawalDetails">
          <h2>Withdrawal Details</h2>
          <table className="withdrawalTable">
            <thead>
              <tr>
                <th>Account Number</th>
                <th>Account Name</th>
                <th>Previous Balance</th>
                <th>Amount Withdrawn</th>
                <th>Type</th>
                <th>Total Balance</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{withdrawalDetails.accountNumber}</td>
                <td>{withdrawalDetails.prevBalance?.[0]?.[0]?.name || "N/A"}</td>
                <td>{withdrawalDetails.prevBalance?.[0]?.[0]?.balance || "N/A"}</td>
                <td>{withdrawalDetails.amount}</td>
                <td>{withdrawalDetails.type}</td>
                <td>{withdrawalDetails.mainBalance?.[0]?.[0]?.balance || "N/A"}</td>
                <td>{new Date(withdrawalDetails.timestamp).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Withdraw;

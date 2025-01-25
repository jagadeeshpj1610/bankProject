import React, { useState } from "react";
import '../css/deposit.css';

const Deposit = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const handleDeposit = async (event) => {
    event.preventDefault();

    if (!accountNumber || !amount) {
      setMessage("Account number and amount are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/admin/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, amount })
      });
      const result1 = await response.json();
      setResult(result1)
      console.log(result1)
      if (response.status === 200) {
        setMessage("Deposit successful");
      } else {
        setMessage("Failed to deposit");
      }
    } catch (error) {
      setMessage("Network error, please try again later.");
    }
  };

  return (
    <div className="depositContainer">
      <h1 className="depositTitle">Deposit</h1>
      <form className="depositForm">
        <input className="inputField" type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
        <input className="inputField" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button className="depositButton" type="submit" onClick={handleDeposit}>Deposit</button>
      </form>

      {message && <p>{message}</p>}
      <p>{result.accountNumber}</p>
      <p>{result.prevBalance[0][0].balance}</p>
      <p>{result.amount}</p>
      <p>{new Date(result.timestamp).toLocaleString()}</p>
      <p>{result.type}</p>
      <p>{result.mainBalance[0][0].balance}</p>
    </div>
  )
};

export default Deposit;

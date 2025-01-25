import React, { useState } from "react";
import '../css/MoneyTransfer.css';

const MoneyTransfer = () => {
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const fetchAccountDetails = async (accountNumber, setNameCallback) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`);
      const data = await response.json();
      setNameCallback(data?.userDetails?.[0]?.name || "Invalid user");
    } catch {
      setNameCallback("Not Found");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!senderAccount || !receiverAccount || !amount) return setMessage("All fields are required.");
    if (senderAccount === receiverAccount) return setMessage("Sender and receiver account numbers cannot be the same.");
    try {
      const response = await fetch("http://localhost:8000/api/admin/moneyTransfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender_account: senderAccount, receiver_account: receiverAccount, amount }),
      });
      const resultData = await response.json();
      setResult(resultData);
      setMessage(response.ok ? "Transfer successful" : resultData.error || "Transfer failed");
    } catch {
      setMessage("Network error, please try again later.");
    }
  };

  const TransferResult = () => (
    <div className="depositResult">
      {message && <p>{message}</p>}
      {result && (
        <>
          <p>Sender Account: {result.sender_account}</p>
          <p>Sender Name: {result.senderDetails?.[0]?.name || "Not Found"}</p>
          <p>Receiver Account: {result.receiver_account}</p>
          <p>Receiver Name: {result.receiverDetails?.[0]?.name || "Not Found"}</p>
          <p>Type: {result.type}</p>
          <p>Amount: {result.tranferAmount}</p>
          <p>Date: {new Date(result.timestamp).toLocaleString()}</p>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="moneyTransfer">
        <h1 className="moneyTransferTitle">Money Transfer</h1>
        <form className="transferForm">
          <input className="inputField" type="text" placeholder="Sender Account" value={senderAccount} onChange={(e) => setSenderAccount(e.target.value)} onBlur={() => fetchAccountDetails(senderAccount, setSenderName)} required />
          {senderName && <p>Sender Name: {senderName}</p>}
          <input className="inputField" type="text" placeholder="Receiver Account" value={receiverAccount} onChange={(e) => setReceiverAccount(e.target.value)} onBlur={() => fetchAccountDetails(receiverAccount, setReceiverName)} required />
          {receiverName && <p>Receiver Name: {receiverName}</p>}
          <input className="inputField" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <button className="transferButton" type="submit" onClick={handleTransfer}>Transfer</button>
        </form>
        {message && <p className={`message ${message === "Transfer successful" ? "success" : "error"}`}>{message}</p>}
      </div>
      <TransferResult />
    </>
  );
};

export default MoneyTransfer;


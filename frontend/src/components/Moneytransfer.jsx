import React, { useState } from "react";
import "../css/MoneyTransfer.css";

const MoneyTransfer = () => {
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAccountDetails = async (accountNumber, setNameCallback) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNameCallback(data?.userDetails?.[0]?.name || "Invalid user");
    } catch {
      setNameCallback("Not Found");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!senderAccount || !receiverAccount || !amount) {
      return setMessage("All fields are required.");
    }

    if (senderAccount === receiverAccount) {
      return setMessage("Sender and receiver account numbers cannot be the same.");
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/admin/moneyTransfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender_account: senderAccount, receiver_account: receiverAccount, amount }),
      });

      const resultData = await response.json();

      if (response.ok) {
        setResult(resultData);
        setMessage("Transfer successful");
        setSenderAccount("");
        setReceiverAccount("");
        setAmount("");
        setSenderName("");
        setReceiverName("");
      } else {
        setMessage(resultData.error || "Transfer failed");
        setResult(null);
      }
    } catch {
      setMessage("Network error, please try again later.");
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const TransferResult = () => (
    <div className="transferResult">
      {message && <p className={`message ${message === "Transfer successful" ? "success" : "error"}`}>{message}</p>}
      {result && (
        <table className="transferDetails">
          <thead>
            <tr>
              <th>Sender Account</th>
              <th>Sender Name</th>
              <th>Receiver Account</th>
              <th>Receiver Name</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{result.sender_account}</td>
              <td>{result.senderDetails?.name || "Not Found"}</td>
              <td>{result.receiver_account}</td>
              <td>{result.receiverDetails?.name || "Not Found"}</td>
              <td>{result.transferAmount}</td>
              <td>{result.type}</td>
              <td>{new Date(result.timestamp).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <>
    <div className="moneyTransfer">
      <h1 className="moneyTransferTitle">Money Transfer</h1>
      <form className="transferForm" onSubmit={handleTransfer}>
        <label htmlFor="">Sender Account Number</label>
        <input
          className="inputField"
          type="text"
          placeholder="Sender Account"
          value={senderAccount}
          onChange={(e) => setSenderAccount(e.target.value)}
          onBlur={() => fetchAccountDetails(senderAccount, setSenderName)}
          required
        />
        {senderName && <p>Sender Name: {senderName}</p>}
        <label htmlFor="">Recevier Account Nuber</label>
        <input
          className="inputField"
          type="text"
          placeholder="Receiver Account"
          value={receiverAccount}
          onChange={(e) => setReceiverAccount(e.target.value)}
          onBlur={() => fetchAccountDetails(receiverAccount, setReceiverName)}
          required
        />
        {receiverName && <p>Receiver Name: {receiverName}</p>}
        <label htmlFor="">Amount</label>
        <input
          className="inputField"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button className="transferButton" type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Transfer"}
        </button>
      </form>

    </div>
     <TransferResult />
     </>
  );
};

export default MoneyTransfer;

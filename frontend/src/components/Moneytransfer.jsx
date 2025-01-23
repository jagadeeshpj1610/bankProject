import React, { useState } from "react";

const MoneyTransfer = () => {
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleTransfer = async (event) => {
    event.preventDefault();

    if (!senderAccount || !receiverAccount || !amount) {
      console.log("All fields are required");
      return;
    }

    const data = { sender_account: senderAccount, receiver_account: receiverAccount, amount };
    try {
      const response = await fetch("http://localhost:8000/api/admin/money_tranfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Transfer successful");
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      console.error("Network error, please try again later.");
    }
  };

  return (
    <div>
      <h1>Money Transfer</h1>
      <form>
        <input type="text" placeholder="Sender Account Number" value={senderAccount} onChange={(e) => setSenderAccount(e.target.value)} required />
        <input type="text" placeholder="Receiver Account Number" value={receiverAccount} onChange={(e) => setReceiverAccount(e.target.value)} required />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button type="submit" onClick={handleTransfer}>Transfer</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default MoneyTransfer;

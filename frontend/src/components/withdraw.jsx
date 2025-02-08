import React, { useState } from "react";
import '../css/withdraw.css';

const Withdraw = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState({ accountNumber: "", amount: "" });
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


  const validateAccountNumber = (value) => {
    if (isNaN(value) || value.length < 12) {
      setErr((prevErr) => ({ ...prevErr, accountNumber: "Account number must be numeric and at least 12 digits long." }));
      return false;
    }
    setErr((prevErr) => ({ ...prevErr, accountNumber: "" }));
    return true;
  };

  const validateAmount = (value) => {
    if (isNaN(value) || parseFloat(value) <= 0) {
      setErr((prevErr) => ({ ...prevErr, amount: "Amount must be a positive number." }));
      return false;
    }
    setErr((prevErr) => ({ ...prevErr, amount: "" }));
    return true;
  };

  const handleWithdraw = async (event) => {
    event.preventDefault();


    if (!validateAccountNumber(accountNumber) || !validateAmount(amount)) return;

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
        console.log(result);



        setTimeout(() => {
          setMessage("");
          setAccountNumber("");
          setAccountDetails("")
          setAmount("");
        }, 2000);
        setTimeout(() => {
          setWithdrawalDetails(null)
        }, 10000);
      } else {
        setMessage(result.error || "Failed to withdraw");


        setTimeout(() => setMessage(""), 2000);
      }
    } catch {
      setMessage("Network error, please try again later.");

      setTimeout(() => setMessage(""), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="withdrawContainer">
        <h1 className="withdrawTitle">Withdraw</h1>

        {message && <p style={{ color: "green" }}>{message}</p>}

        <form className="withdrawForm" onSubmit={handleWithdraw}>
          <label htmlFor="">Account Number</label>
          <input
            className="inputField"
            type="text"
            placeholder="Account Number"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              validateAccountNumber(e.target.value);
            }}
            onBlur={() => fetchAccountDetails(accountNumber)}
            required
          />
          {err.accountNumber && <p style={{ color: "red" }}>{err.accountNumber}</p>}

          {accountDetails && <p className="confirmName">Account Name: {accountDetails.name}</p>}

          <label htmlFor="">Amount</label>
          <input
            className="inputField"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              validateAmount(e.target.value);
            }}
            required
          />
          {err.amount && <p style={{ color: "red" }}>{err.amount}</p>}

          <button className="withdrawButton" type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Withdraw"}
          </button>
        </form>
      </div>

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


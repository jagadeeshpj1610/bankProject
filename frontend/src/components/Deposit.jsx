import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Deposit.css';

const Deposit = () => {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState({ accountNumber: "", amount: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const [depositDetails, setDepositDetails] = useState(null);

  const fetchAccountDetails = async (accountNumber) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not authenticated. Please log in.");
        return;
      }

      //fetch(`https://magadhabackend.onrender.com/api/admin/search?accountNumber=${accountNumber}`
      //fetch(`http://localhost:8000/api/admin/search?accountNumber=${accountNumber}
      const response = await fetch(`https://magadhabackend.onrender.com/api/admin/search?accountNumber=${accountNumber}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setAccountDetails(data?.userDetails?.[0] || null);
    } catch (error) {
      setMessage("Error fetching account details.");
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

  const handleDeposit = async (event) => {
    event.preventDefault();


    if (!validateAccountNumber(accountNumber) || !validateAmount(amount)) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");


      //fetch("https://magadhabackend.onrender.com/api/admin/deposit"
      //fetch("http://localhost:8000/api/admin/deposit"
      const response = await fetch("https://magadhabackend.onrender.com/api/admin/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ accountNumber, amount }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        setMessage("Deposit successful");
        setDepositDetails(result);

        setTimeout(() => {
          setAccountNumber("");
          setAmount("");
          setAccountDetails(null);
          setMessage("")
        }, 2000);

        setTimeout(() => {
          setErr({ accountNumber: "", amount: "" });
          setMessage("")
        }, 2000);

        setTimeout(() => {
          setDepositDetails(null);
          navigate('/home/adminhome');
        }, 8000);
      } else {
        setMessage(result.error || "Failed to deposit");
      }
    } catch (error) {
      setMessage("Network error, please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="depositContainer">
        <h1 className="depositTitle">Deposit</h1>

        {message && <p style={{ color: "green" }}>{message}</p>}

        <form className="depositForm" onSubmit={handleDeposit}>
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

          <button className="depositButton" type="submit" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Deposit"}
          </button>
        </form>
      </div>

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
                <td>{depositDetails.userName || "N/A"}</td>
                <td>{depositDetails.prevbalance || "N/A"}</td>
                <td>{depositDetails.amount}</td>
                <td>{depositDetails.type}</td>
                <td>{depositDetails.newBalance || "N/A"}</td>
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

// import React, { useState } from "react";

// const Withdraw = () => {
//   const [accountNumber, setAccountNumber] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");

//   const handleWithdraw = async (event) => {
//     event.preventDefault();
//     if (!accountNumber || !amount) {
//       return console.log("Account number and amount are required");
//     }

//     try {
//       const response = await fetch("http://localhost:8000/api/admin/withdraw", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ accountNumber, amount }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setMessage("Withdrawal successful");
//       } else {
//         setMessage(result.error || "Failed to withdraw");
//       }
//     } catch (error) {
//       console.error("Network error, please try again later.");
//       setMessage("Network error, please try again later.");
//     }
//   };

//   return (
//     <div>
//       <h1>Withdraw</h1>
//       <form onSubmit={handleWithdraw}>
//         <input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={{ display: 'inline-block', width: '200px', marginRight: '10px' }} />
//         <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ display: 'inline-block', width: '200px' }} />
//         <button type="submit" style={{ marginLeft: '10px' }}>Withdraw</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Withdraw;


import React, { useState } from "react";

const Withdraw = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = async (event) => {
    event.preventDefault();
    if (!accountNumber || !amount) {
      return console.log("Account number and amount are required");
    }

    const amountToWithdraw = parseFloat(amount);  // Ensure amount is a number

    setIsProcessing(true);  // Disable the button while processing

    try {
      const response = await fetch("http://localhost:8000/api/admin/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountNumber, amount: amountToWithdraw }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Withdrawal successful");
      } else {
        setMessage(result.error || "Failed to withdraw");
      }
    } catch (error) {
      console.error("Network error, please try again later.");
      setMessage("Network error, please try again later.");
    } finally {
      setIsProcessing(false);  // Re-enable the button after request completes
    }
  };

  return (
    <div>
      <h1>Withdraw</h1>
      <form onSubmit={handleWithdraw}>
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
          style={{ display: 'inline-block', width: '200px', marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ display: 'inline-block', width: '200px' }}
        />
        <button type="submit" disabled={isProcessing} style={{ marginLeft: '10px' }}>
          {isProcessing ? "Processing..." : "Withdraw"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Withdraw;

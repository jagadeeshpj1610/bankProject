// import React, { useState } from "react";
// import '../css/withdraw.css';

// const Withdraw = () => {
//   const [accountNumber, setAccountNumber] = useState("");
//   const [amount, setAmount] = useState("");
//   const [message, setMessage] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleWithdraw = async (event) => {
//     event.preventDefault();

//     if (!accountNumber || !amount) {
//       return console.log("Account number and amount are required");
//     }

//     const amountToWithdraw = parseFloat(amount);

//     setIsProcessing(true);

//     try {
//       const response = await fetch("http://localhost:8000/api/admin/withdraw", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ accountNumber, amount: amountToWithdraw }),
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
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="withdrawContainer">
//       <h1 className="withdrawTitle">Withdraw</h1>
//       <form className="withdrawForm" onSubmit={handleWithdraw}>
//         <input
//           className="inputField"
//           type="text"
//           placeholder="Account Number"
//           value={accountNumber}
//           onChange={(e) => setAccountNumber(e.target.value)}
//           required
//         />
//         <input
//           className="inputField"
//           type="number"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />
//         <button className="withdrawButton" type="submit" disabled={isProcessing}>
//           {isProcessing ? "Processing..." : "Withdraw"}
//         </button>
//       </form>
//       {message && <p className={`message ${message.includes("successful") ? 'success' : 'error'}`}>{message}</p>}
//     </div>
//   );
// };

// export default Withdraw;

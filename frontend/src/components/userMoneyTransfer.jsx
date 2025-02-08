// import React, { useState, useEffect } from "react";
// import "../css/moneyTransfer.css";

// const UserMoneyTransfer = () => {
//   const email = localStorage.getItem("email");
//   const [senderAccount, setSenderAccount] = useState('');
//   const [receiverAccount, setReceiverAccount] = useState('');
//   const [amount, setAmount] = useState('');
//   const [accountDetails, setAccountDetails] = useState(null);
//   const [message, setMessage] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [result, setResult] = useState(null);


//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       const fetchUserDetails = async () => {
//         const response = await fetch(`http://localhost:8000/api/userDetails?email=${email}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();

//         if (data?.userDetails?.account_number) {
//           setSenderAccount(data.userDetails.account_number);
//         }
//       };
//       fetchUserDetails();
//     }
//   }, []);


//   const handleTransfer = async (e) => {
//     e.preventDefault();

//     if (!senderAccount || !receiverAccount || !amount || amount <= 0) {
//       return setMessage("Sender account, receiver account, and a valid amount are required.");
//     }

//     setIsProcessing(true);
//     try {
//       const token = localStorage.getItem("token");

//       const transferAmount = parseFloat(amount);

//       const response = await fetch("http://localhost:8000/api/money_transfer", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           sender_account: senderAccount,
//           receiver_account: receiverAccount,
//           amount: transferAmount,
//         }),
//       });

//       if (response.ok) {
//         const resultData = await response.json();



//         setResult(resultData);
//         setMessage("Transfer successful");
//       } else {
//         const errorData = await response.json();
//         setMessage(errorData.error || "Transfer failed");
//         setResult(null);
//       }
//     } catch (err) {
//       setMessage("Network error, please try again later.");
//       setResult(null);
//     } finally {
//       setIsProcessing(false);
//     }
//   };


//   useEffect(() => {
//     if (receiverAccount) {
//       const fetchAccountDetails = async () => {
//         const token = localStorage.getItem("token");

//         const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${receiverAccount}`, {
//           method: "GET",
//           headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         });

//         const data = await response.json();
//         setAccountDetails(data?.userDetails?.[0] || null);
//       };
//       fetchAccountDetails();
//     }
//   }, [receiverAccount]);


//   const TransferResult = () => (
//     <div className="user-transfer-result">
//       {message && <p className={`user-transfer-message ${message === "Transfer successful" ? "success" : "error"}`}>{message}</p>}
//       {result && (
//         <table className="user-transfer-table">
//           <thead>
//             <tr>
//               <th>Sender Account</th>
//               <th>Sender Name</th>
//               <th>Receiver Account</th>
//               <th>Receiver Name</th>
//               <th>Transfer Amount</th>
//               <th>Date & Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>{result.sender_account}</td>
//               <td>{result.senderDetails?.name || "Not Found"}</td>
//               <td>{result.receiver_account}</td>
//               <td>{result.receiverDetails?.name || "Not Found"}</td>
//               <td>{result.transferAmount}</td>
//               <td>{new Date(result.timestamp).toLocaleString()}</td>
//             </tr>
//           </tbody>
//         </table>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <div className="user-transfer-container">
//         <h1 className="user-transfer-title">Money Transfer</h1>
//         <form onSubmit={handleTransfer} className="user-transfer-form">
//           <div className="user-transfer-group">
//             <label className="user-transfer-label">Sender Account Number:</label>
//             <input type="text" value={senderAccount} readOnly className="user-transfer-input" />
//           </div>
//           <div className="user-transfer-group">
//             <label className="user-transfer-label">Receiver Account Number:</label>
//             <input
//               type="text"
//               value={receiverAccount}
//               onChange={(e) => setReceiverAccount(e.target.value)}
//               className="user-transfer-input"
//             />
//             {accountDetails && <p className="user-transfer-receiver-details">Receiver Name: {accountDetails.name}</p>}
//           </div>
//           <div className="user-transfer-group">
//             <label className="user-transfer-label">Amount:</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               min="1"
//               className="user-transfer-input"
//             />
//           </div>
//           <button type="submit" disabled={isProcessing} className="user-transfer-button">
//             {isProcessing ? "Processing..." : "Transfer"}
//           </button>
//         </form>
//       </div>
//       <TransferResult />
//     </>
//   );
// };

// export default UserMoneyTransfer;


import React, { useState, useEffect } from "react";
import "../css/moneyTransfer.css";

const UserMoneyTransfer = () => {
  const email = localStorage.getItem("email");
  const [senderAccount, setSenderAccount] = useState("");
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchUserDetails = async () => {
        const response = await fetch(`http://localhost:8000/api/userDetails?email=${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data?.userDetails?.account_number) {
          setSenderAccount(data.userDetails.account_number);
        }
      };
      fetchUserDetails();
    }
  }, []);

  // Separate Validation Function
  const validateTransfer = () => {
    if (!senderAccount || !receiverAccount || !amount || amount <= 0) {
      setMessage("Sender account, receiver account, and a valid amount are required.");
      setTimeout(() => setMessage(""), 2000);
      return false;
    }

    if (senderAccount === receiverAccount) {
      setMessage("Sender and receiver accounts cannot be the same.");
      setTimeout(() => setMessage(""), 2000);
      return false;
    }

    return true;
  };

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!validateTransfer()) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const transferAmount = parseFloat(amount);

      const response = await fetch("http://localhost:8000/api/money_transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_account: senderAccount,
          receiver_account: receiverAccount,
          amount: transferAmount,
        }),
      });

      if (response.ok) {
        const resultData = await response.json();
        setResult(resultData);
        setMessage("Transfer successful");

        setTimeout(() => {
          setReceiverAccount("");
          setAmount("");
          setMessage("");
          setAccountDetails("");
        }, 2000);
        setTimeout(() => {
          setResult(null);
        }, 10000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Transfer failed");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      setMessage("Network error, please try again later.");
      setTimeout(() => setMessage(""), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (receiverAccount) {
      const fetchAccountDetails = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8000/api/admin/search?accountNumber=${receiverAccount}`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setAccountDetails(data?.userDetails?.[0] || null);
      };
      fetchAccountDetails();
    }
  }, [receiverAccount]);

  const TransferResult = () => (
    <div className="user-transfer-result">
      {result && (
        <table className="user-transfer-table">
          <thead>
            <tr>
              <th>Sender Account</th>
              <th>Sender Name</th>
              <th>Receiver Account</th>
              <th>Receiver Name</th>
              <th>Transfer Amount</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{result.sender_account}</td>
              <td>{result.senderDetails?.name || "Not Found"}</td>
              <td>{result.receiver_account}</td>
              <td>{result.receiverDetails?.name || "Not Found"}</td>
              <td>{result.transferAmount}</td>
              <td>{new Date(result.timestamp).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <>
      <div className="user-transfer-container">
        <h1 className="user-transfer-title">Money Transfer</h1>
        {message && <p className={`user-transfer-message ${message === "Transfer successful" ? "success" : "error"}`}>{message}</p>}
        <form onSubmit={handleTransfer} className="user-transfer-form">
          <div className="user-transfer-group">
            <label className="user-transfer-label">Sender Account Number:</label>
            <input type="text" value={senderAccount} readOnly className="user-transfer-input" />
          </div>
          <div className="user-transfer-group">
            <label className="user-transfer-label">Receiver Account Number:</label>
            <input
              type="text"
              value={receiverAccount}
              onChange={(e) => setReceiverAccount(e.target.value)}
              className="user-transfer-input"
            />
            {accountDetails && <p className="user-transfer-receiver-details">Receiver Name: {accountDetails.name}</p>}
          </div>
          <div className="user-transfer-group">
            <label className="user-transfer-label">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              className="user-transfer-input"
            />
          </div>
          <button type="submit" disabled={isProcessing} className="user-transfer-button">
            {isProcessing ? "Processing..." : "Transfer"}
          </button>
        </form>
      </div>
      <TransferResult />
    </>
  );
};

export default UserMoneyTransfer;

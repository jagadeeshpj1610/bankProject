const db = require('../models/db');

const { moneyTransferSenderTemplate, moneyTransferReceiverTemplate } = require('../utils/emailtemplates')
const sendEmail = require('../utils/emailService');


// const getUserDetailsAndTransactions = async (req, res) => {
//   const { email } = req.query;

//   if (!email) {
//     return res.status(400).json({ error: "Email is required" });
//   }

//   try {
//     const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//     if (user.length === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const userDetails = user[0];

//     const [transactions] = await db.query(
//       "SELECT * FROM money_transfers WHERE sender_account = ? OR receiver_account = ?",
//       [userDetails.account_number, userDetails.account_number]
//     );

//     if (transactions.length === 0) {
//       return res.json({ userDetails });
//     }

//     const accountNumbers = transactions.map((t) => t.receiver_account);
//     const [receivers] = await db.query(
//       "SELECT account_number, name FROM users WHERE account_number IN (?)",
//       [accountNumbers]
//     );

//     const receiverNameMap = {};
//     for (const receiver of receivers) {
//       receiverNameMap[receiver.account_number] = receiver.name;
//     }

//     const transactionsWithDetails = [];
//     for (const transaction of transactions) {
//       const updatedTransaction = {
//         id: transaction.id,
//         sender_account: transaction.sender_account,
//         receiver_account: transaction.receiver_account,
//         amount: transaction.amount,
//         timestamp: transaction.timestamp,
//         type: transaction.sender_account === userDetails.account_number ? "Debited" : "Credited",
//         receiver_name: receiverNameMap[transaction.receiver_account] || "Unknown"
//       };
//       transactionsWithDetails.push(updatedTransaction);
//     }

//     return res.json({ userDetails, transactions: transactionsWithDetails });
//   } catch (error) {
//     console.error("Error fetching user details or transactions:", error);
//     return res.status(500).json({ error: "Failed to retrieve data" });
//   }
// };

const getUserDetailsAndTransactions = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userDetails = user[0];

    const [transactions] = await db.query(
      "SELECT * FROM money_transfers WHERE sender_account = ? OR receiver_account = ?",
      [userDetails.account_number, userDetails.account_number]
    );

    if (transactions.length === 0) {
      return res.json({ userDetails });
    }

    const receiverAccounts = transactions.map((t) => t.receiver_account);
    const senderAccounts = transactions.map((t) => t.sender_account);
    const allAccounts = [...new Set([...receiverAccounts, ...senderAccounts])];

    const [usersInvolved] = await db.query(
      "SELECT account_number, name FROM users WHERE account_number IN (?)",
      [allAccounts]
    );

    const accountNameMap = {};
    for (const user of usersInvolved) {
      accountNameMap[user.account_number] = user.name;
    }

    const transactionsWithDetails = [];
    for (const transaction of transactions) {
      const updatedTransaction = {
        id: transaction.id,
        sender_account: transaction.sender_account,
        receiver_account: transaction.receiver_account,
        amount: transaction.amount,
        timestamp: transaction.timestamp,
        type: transaction.sender_account === userDetails.account_number ? "Debited" : "Credited",
        receiver_name: accountNameMap[transaction.receiver_account] || "Unknown",
        sender_name: accountNameMap[transaction.sender_account] || "Unknown"
      };
      transactionsWithDetails.push(updatedTransaction);
    }

    return res.json({ userDetails, transactions: transactionsWithDetails });
  } catch (error) {
    console.error("Error fetching user details or transactions:", error);
    return res.status(500).json({ error: "Failed to retrieve data" });
  }
};




const money_transfer = async (req, res) => {
  const { sender_account, receiver_account, amount } = req.body;

  if (!sender_account || !receiver_account || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (sender_account === receiver_account) {
    return res.status(400).json({ error: "Sender and receiver account numbers cannot be the same" });
  }

  try {
    const [senderDetails] = await db.query("SELECT * FROM users WHERE account_number = ?", [sender_account]);
    const [receiverDetails] = await db.query("SELECT * FROM users WHERE account_number = ?", [receiver_account]);

    if (senderDetails.length === 0 || receiverDetails.length === 0) {
      return res.status(404).json({ error: "Receiver account not found" });
    }

    const senderBalance = parseFloat(senderDetails[0].balance);
    const transferAmount = parseFloat(amount);

    if (senderBalance <= 0 || senderBalance < transferAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await db.query("UPDATE users SET balance = balance - ? WHERE account_number = ?", [transferAmount, sender_account]);
    await db.query("UPDATE users SET balance = balance + ? WHERE account_number = ?", [transferAmount, receiver_account]);

    const [currentSenderBalance] = await db.query("SELECT balance FROM users WHERE account_number = ?", [sender_account]);

    await db.query("INSERT INTO money_transfers (sender_account, receiver_account, amount, timestamp) VALUES (?, ?, ?, NOW())", [sender_account, receiver_account, transferAmount]);


    (async () => {
      try {
        if (senderDetails[0].email) {
          const senderEmailContent = moneyTransferSenderTemplate({
            sender_name: senderDetails[0].name,
            receiver_name: receiverDetails[0].name,
            receiver_account,
            amount: transferAmount,
            newBalance: currentSenderBalance[0].balance,
          });
          await sendEmail(senderDetails[0].email, senderEmailContent.subject, senderEmailContent.text);
        }

        if (receiverDetails[0].email) {
          const receiverEmailContent = moneyTransferReceiverTemplate({
            receiver_name: receiverDetails[0].name,
            sender_name: senderDetails[0].name,
            sender_account,
            amount: transferAmount,
            newBalance: receiverDetails[0].balance + transferAmount,
          });
          await sendEmail(receiverDetails[0].email, receiverEmailContent.subject, receiverEmailContent.text);
        }
      } catch (emailError) {
        console.error("Error sending money transfer emails:", emailError);
      }
    })();

    return res.json({ message: "Transfer successful", sender_account, senderDetails: senderDetails[0], receiver_account,  receiverDetails: receiverDetails[0], transferAmount,  timestamp: new Date(), senderBalance: currentSenderBalance[0].balance });
  } catch (error) {
    console.error("Error transferring amount:", error);
    return res.status(500).json({ error: "Failed to transfer amount" });
  }
};






module.exports = {getUserDetailsAndTransactions,  money_transfer };

const db = require('../models/db');
const sendEmail = require('../utils/emailService');
const jwt = require('jsonwebtoken');

const { adminAccountCreationTemplate, depositTemplate, withdrawalTemplate, moneyTransferReceiverTemplate, moneyTransferSenderTemplate } = require('../utils/emailtemplates')




const editUser = async (req, res) => {
  const { account_number } = req.params;
  const { name, email, phone, address, aadhaar } = req.body;

  try {
    const [existingPhone] = await db.execute(
      'SELECT * FROM users WHERE phone = ? AND account_number != ?',
      [phone, account_number]
    );

    if (existingPhone.length > 0) {
      return res.status(400).json({ error: "Phone number already exists." });
    }

    const [currentUser] = await db.execute('SELECT * FROM users WHERE account_number = ?', [account_number]);

    if (currentUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const [result] = await db.execute(
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, aadhaar = ? WHERE account_number = ?',
      [name, email, phone, address, aadhaar, account_number]
    );

    const [adminUser] = await db.execute(
      'SELECT * FROM admins WHERE email = ?',
      [currentUser[0].email]
    );

    if (adminUser.length > 0) {
      await db.execute('UPDATE logins SET email = ? WHERE email = ?', [email, currentUser[0].email]);
    } else {
      console.log("No matching user found in admins table.");
    }

    if (result.affectedRows > 0) {
      return res.json({ message: 'User details updated successfully!' });
    } else {
      return res.status(400).json({ error: 'Failed to update user details.' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user details.' });
  }
};




const createAccount = async (req, res) => {
  const { name, dob, balance, email, aadhaar, phone, address, accountType } = req.body;

  if (!name || !dob || !balance || !email || !aadhaar || !phone || !address || !accountType)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const [results] = await db.execute('SELECT * FROM users WHERE email = ? OR phone = ?', [email, phone]);

    if (results.length > 0)
      return res.status(400).json({ message: 'Account with this email or phone number already exists.' });

    const accountNumber = `12340000${Math.floor(Math.random() * 10000)}`;

    await db.execute('INSERT INTO users (account_number, name, dob, balance, email, aadhaar, phone, address, account_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [accountNumber, name, dob, balance, email, aadhaar, phone, address, accountType]);

    await db.execute('INSERT INTO transactions (account_number, type, amount, timestamp, details) VALUES (?, ?, ?, NOW(), ?)',
      [accountNumber, 'deposit', balance, 'Initial deposit']);

    const emailContent = adminAccountCreationTemplate({ name, account_number: accountNumber, balance });
    (async () => {
      try {
        await sendEmail(email, emailContent.subject, emailContent.text);
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    })();

    res.status(201).json({ message: 'Account created successfully!', accountNumber });
  } catch (err) {
    console.error('Error creating account or transaction:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// const deleteUser = (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required" });

//   db.query("UPDATE logins SET is_deleted = 1 WHERE email = ?", [email], (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Server Error" });
//     }
//     res.status(200).json({ message: "User Deleted Successfully" });
//   });
// };

// const restoreUser = (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required" });

//   db.query("UPDATE logins SET is_deleted = 0 WHERE email = ?", [email], (err) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "Server Error" });
//     }
//     res.status(200).json({ message: "User Restored Successfully" });
//   });
// };












const fetchUserDetails = async (req, res) => {
  const accountNumber = req.query.accountNumber;

  if (!accountNumber) {
    return res.status(400).json({ error: "Account number is required" });
  }

  try {

    const userQuery = "SELECT * FROM users WHERE account_number = ?";
    const [userDetails] = await db.query(userQuery, [accountNumber]);


    const transactionQuery = "SELECT * FROM transactions WHERE account_number = ?";
    const [transactions] = await db.query(transactionQuery, [accountNumber]);


    const transferQuery = "SELECT * FROM money_transfers WHERE sender_account = ? OR receiver_account = ?";
    const [moneyTransfers] = await db.query(transferQuery, [accountNumber, accountNumber]);

    //const loginDetails = await db.query("SELECT is_deleted FROM logins WHERE email = ?", [userDetails[0].email]);

    for (let transfer of moneyTransfers) {

      const senderQuery = "SELECT name FROM users WHERE account_number = ?";
      const [senderResult] = await db.query(senderQuery, [transfer.sender_account]);
      transfer.sender_name = senderResult.length > 0 ? senderResult[0].name : "Unknown";

      const receiverQuery = "SELECT name FROM users WHERE account_number = ?";
      const [receiverResult] = await db.query(receiverQuery, [transfer.receiver_account]);
      transfer.receiver_name = receiverResult.length > 0 ? receiverResult[0].name : "Unknown";

      transfer.type = transfer.sender_account !== accountNumber ? "credit" : "debit";
    }

    return res.json({
      userDetails, transactions, moneyTransfers,
      //is_deleted: loginDetails[0][0].is_deleted
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch account details" });
  }
};





const deposit = async (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount) {
    return res.status(400).json({ error: "Account number and amount are required." });
  }

  try {
    const [[user]] = await db.query("SELECT balance, name, email FROM users WHERE account_number = ?", [accountNumber]);
    if (!user) {
      return res.status(404).json({ error: "Account not found." });
    }

    await db.query("UPDATE users SET balance = balance + ? WHERE account_number = ?", [amount, accountNumber]);

    await db.query(
      "INSERT INTO transactions (account_number, type, amount, timestamp, details) VALUES (?, ?, ?, NOW(), ?)",
      [accountNumber, "deposit", amount, "Deposit"]
    );

    const [[updatedUser]] = await db.query("SELECT balance FROM users WHERE account_number = ?", [accountNumber]);

    const emailContent = depositTemplate({
      user_name: user.name,
      account_number: accountNumber,
      amount: amount,
      new_balance: updatedUser.balance,
      type: user.type,
    });

    (async () => {
      try {
        await sendEmail(user.email, emailContent.subject, emailContent.text);
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    })();

    return res.json({
      message: "Deposit successful.",
      accountNumber,
      amount,
      prevbalance: user.balance,
      timestamp: new Date(),
      newBalance: updatedUser.balance,
      userName: user.name,
      type: 'Deposit',
    });

  } catch (error) {
    console.error("Error in deposit transaction:", error);
    return res.status(500).json({ error: "Failed to deposit amount." });
  }
};





const withdraw = async (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount) {
    return res.status(400).json({ error: "Account number and amount are required." });
  }

  try {
    const [[user]] = await db.query("SELECT balance, name, email FROM users WHERE account_number = ?", [accountNumber]);
    if (!user) {
      return res.status(404).json({ error: "Account not found." });
    }

    const withdrawalAmount = parseFloat(amount);
    if (user.balance < withdrawalAmount) {
      return res.status(400).json({ error: "Insufficient balance." });
    }

    await db.query("UPDATE users SET balance = balance - ? WHERE account_number = ?", [withdrawalAmount, accountNumber]);
    await db.query(
      "INSERT INTO transactions (account_number, type, amount, timestamp, details) VALUES (?, ?, ?, NOW(), ?)",
      [accountNumber, "withdraw", withdrawalAmount, "Withdrawal"]
    );

    const [[updatedUser]] = await db.query("SELECT balance FROM users WHERE account_number = ?", [accountNumber]);

    const emailContent = withdrawalTemplate({
      user_name: user.name,
      account_number: accountNumber,
      amount: withdrawalAmount,
      new_balance: updatedUser.balance,
    });

    (async () => {
      try {
        await sendEmail(user.email, emailContent.subject, emailContent.text);
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    })();

    return res.json({
      message: "Withdrawal successful.",
      accountNumber,
      amount,
      prevbalance: user.balance,
      timestamp: new Date(),
      type: "Withdraw",
      newBalance: updatedUser.balance,
      userName: user.name,
    });

  } catch (error) {
    console.error("Error in withdrawal transaction:", error);
    return res.status(500).json({ error: "Failed to withdraw amount." });
  }
};





const money_transfer = async (req, res) => {
  const { sender_account, receiver_account, amount } = req.body;

  if (!sender_account || !receiver_account || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [sender] = await db.query("SELECT name, email, balance FROM users WHERE account_number = ?", [sender_account]);
    const [receiver] = await db.query("SELECT name, email FROM users WHERE account_number = ?", [receiver_account]);

    if (sender.length === 0 || receiver.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const senderBalance = parseFloat(sender[0].balance);
    const transferAmount = parseFloat(amount);

    if (senderBalance <= 0) {
      return res.status(400).json({ error: "Sender account has insufficient balance for any transaction" });
    }

    if (senderBalance < transferAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await db.query("UPDATE users SET balance = balance - ? WHERE account_number = ?", [transferAmount, sender_account]);
    await db.query("UPDATE users SET balance = balance + ? WHERE account_number = ?", [transferAmount, receiver_account]);

    await db.query("INSERT INTO money_transfers (sender_account, receiver_account, amount, type, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [sender_account, receiver_account, transferAmount, "debit"]);
    await db.query("INSERT INTO money_transfers (sender_account, receiver_account, amount, type, timestamp) VALUES (?, ?, ?, ?, NOW())",
      [receiver_account, sender_account, transferAmount, "credit"]);

    const [updatedSender] = await db.query("SELECT balance FROM users WHERE account_number = ?", [sender_account]);
    const [updatedReceiver] = await db.query("SELECT balance FROM users WHERE account_number = ?", [receiver_account]);

    const senderContent = moneyTransferSenderTemplate({
      sender_name: sender[0].name,
      sender_account,
      amount: transferAmount,
      new_balance: updatedSender[0].balance,
    });

    (async () => {
      try {
        await sendEmail(sender[0].email, senderContent.subject, senderContent.text);
      } catch (error) {
        console.error("Failed to send sender email:", error);
      }
    })();

    const receiverContent = moneyTransferReceiverTemplate({
      receiver_name: receiver[0].name,
      receiver_account,
      amount: transferAmount,
      new_balance: updatedReceiver[0].balance,
    });

    (async () => {
      try {
        await sendEmail(receiver[0].email, receiverContent.subject, receiverContent.text);
      } catch (error) {
        console.error("Failed to send receiver email:", error);
      }
    })();

    return res.json({
      message: "Money transfer successful.",
      sender_account,
      sender_details: sender[0],
      receiver_account,
      receiver_details: receiver[0],
      amount,
      timestamp: new Date(),
      type: "money transfer",
      senderNewBalance: updatedSender[0].balance,
      receiverNewBalance: updatedReceiver[0].balance,
    });

  } catch (error) {
    console.error("Error in money transfer:", error);
    return res.status(500).json({ error: "Money transfer failed." });
  }
};



module.exports = {
  //deleteUser, restoreUser,
  editUser, createAccount, fetchUserDetails, deposit, withdraw, money_transfer
};
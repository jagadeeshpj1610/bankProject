const db = require('../models/db');
const sendEmail = require('../utils/emailService');
const jwt = require('jsonwebtoken');

const { adminAccountCreationTemplate, depositTemplate, withdrawalTemplate, moneyTransferReceiverTemplate, moneyTransferSenderTemplate } = require('../utils/emailtemplates')






const editUser = async (req, res) => {
  const { account_number } = req.params;
  const { name, email, phone, address, aadhaar } = req.body;


  const [existingPhone] = await db.execute(
    'SELECT * FROM users WHERE phone = ? AND account_number != ?',
    [phone, account_number]
  );

  if (existingPhone.length > 0) {
    return res.status(400).json({ error: "Phone number already exists." });
  }

  try {
    const [result] = await db.execute(
      'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, aadhaar = ? WHERE account_number = ?',
      [name, email, phone, address, aadhaar, account_number]
    );

    res.json({ message: 'User details updated successfully!' });
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
      await sendEmail(email, emailContent.subject, emailContent.text);

    res.status(201).json({ message: 'Account created successfully!', accountNumber, "accountNumber": accountNumber });
  } catch (err) {
    console.error('Error creating account or transaction:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};





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


    for (let transfer of moneyTransfers) {

      const senderQuery = "SELECT name FROM users WHERE account_number = ?";
      const [senderResult] = await db.query(senderQuery, [transfer.sender_account]);
      transfer.sender_name = senderResult.length > 0 ? senderResult[0].name : "Unknown";

      const receiverQuery = "SELECT name FROM users WHERE account_number = ?";
      const [receiverResult] = await db.query(receiverQuery, [transfer.receiver_account]);
      transfer.receiver_name = receiverResult.length > 0 ? receiverResult[0].name : "Unknown";

      transfer.type = transfer.sender_account !== accountNumber ? "credit" : "debit";
    }

    return res.json({ userDetails, transactions, moneyTransfers });
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
      type:user.type,
    });

    await sendEmail(user.email, emailContent.subject, emailContent.text);



    return res.json({
      message: "Deposit successful.",
      accountNumber,
      amount,
      prevbalance:user.balance,
      timestamp: new Date(),
      newBalance: updatedUser.balance,
      userName: user.name,
      type:'Deposit',
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

    await sendEmail(user.email, emailContent.subject, emailContent.text);

    return res.json({
      message: "Withdrawal successful.",
      accountNumber,
      amount,
      prevbalance:user.balance,
      timestamp: new Date(),
      type:"Withdraw",
      newBalance: updatedUser.balance,
      userName: user.name,
    });

  } catch (error) {
    console.error("Error in withdrawal transaction:", error);
    return res.status(500).json({ error: "Failed to withdraw amount." });
  }
};



// const money_transfer = async (req, res) => {
//   const { sender_account, receiver_account, amount } = req.body;

//   if (!sender_account || !receiver_account || !amount) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const [sender] = await db.query("SELECT name, email, balance FROM users WHERE account_number = ?", [sender_account]);
//     const [receiver] = await db.query("SELECT name, email FROM users WHERE account_number = ?", [receiver_account]);

//     if (sender.length === 0 || receiver.length === 0) {
//       return res.status(404).json({ error: "Account not found" });
//     }

//     const senderBalance = parseFloat(sender[0].balance);
//     const transferAmount = parseFloat(amount);

//     if (senderBalance <= 0) {
//       return res.status(400).json({ error: "Sender account has insufficient balance for any transaction" });
//     }

//     if (senderBalance < transferAmount) {
//       return res.status(400).json({ error: "Insufficient balance" });
//     }

//     const senderType = 'debit';
//     const receiverType = 'credit';

//     const senderTransferQuery = "INSERT INTO money_transfers (sender_account, receiver_account, amount, type, timestamp) VALUES (?, ?, ?, ?, NOW())";
//     await db.query(senderTransferQuery, [sender_account, receiver_account, transferAmount, senderType]);

//     const receiverTransferQuery = "INSERT INTO money_transfers (sender_account, receiver_account, amount, type, timestamp) VALUES (?, ?, ?, ?, NOW())";
//     await db.query(receiverTransferQuery, [sender_account, receiver_account, transferAmount, receiverType]);

//     const senderQuery = "UPDATE users SET balance = balance - ? WHERE account_number = ?";
//     await db.query(senderQuery, [transferAmount, sender_account]);

//     const receiverQuery = "UPDATE users SET balance = balance + ? WHERE account_number = ?";
//     await db.query(receiverQuery, [transferAmount, receiver_account]);



//     if (!sender[0]?.email || !receiver[0]?.email) {
//       console.error("Error: Missing email for sender or receiver.");
//       return res.status(500).json({ error: "Transaction completed, but email notification failed due to missing recipient email." });
//     }

//     const senderMessage = `Hello ${sender[0].name},\n\nYou have successfully transferred ₹${amount} to ${receiver[0].name} (Account No: ${receiver_account}).\n\nThank you for using our service.`;
//     const receiverMessage = `Hello ${receiver[0].name},\n\nYou have received ₹${amount} from ${sender[0].name} (Account No: ${sender_account}).\n\nThank you for using our service.`;

//     await sendEmail(sender[0].email, "Transaction Successful", senderMessage);
//     await sendEmail(receiver[0].email, "Transaction Received", receiverMessage);

//     return res.json({
//       message: "Transfer successful",
//       sender_account,
//       senderDetails: sender[0],
//       receiver_account,
//       receiverDetails: receiver[0],
//       transferAmount,
//       timestamp: new Date(),
//       type: "money_transfer",
//     });
//   } catch (error) {
//     console.error("Error transferring amount:", error);
//     return res.status(500).json({ error: "Failed to transfer amount" });
//   }
// };

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
      [sender_account, receiver_account, transferAmount, "credit"]);

    const [newSenderBalance] = await db.query("SELECT balance FROM users WHERE account_number = ?", [sender_account]);
    const [newReceiverBalance] = await db.query("SELECT balance FROM users WHERE account_number = ?", [receiver_account]);

    if (sender[0].email) {
      const senderEmailContent = moneyTransferSenderTemplate({
        sender_name: sender[0].name,
        receiver_name: receiver[0].name,
        receiver_account,
        amount: transferAmount,
        newBalance: newSenderBalance[0].balance,
      });
      await sendEmail(sender[0].email, senderEmailContent.subject, senderEmailContent.text);
    }

    if (receiver[0].email) {
      const receiverEmailContent = moneyTransferReceiverTemplate({
        receiver_name: receiver[0].name,
        sender_name: sender[0].name,
        sender_account,
        amount: transferAmount,
        newBalance: newReceiverBalance[0].balance,
      });
      await sendEmail(receiver[0].email, receiverEmailContent.subject, receiverEmailContent.text);
    }

    return res.json({
      message: "Transfer successful",
      sender_account,
      senderDetails: sender[0],
      receiver_account,
      receiverDetails: receiver[0],
      transferAmount,
      timestamp: new Date(),
      type: "money_transfer",
    });

  } catch (error) {
    console.error("Error transferring amount:", error);
    return res.status(500).json({ error: "Failed to transfer amount" });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM admins WHERE email = ? AND password = ?", [email, password]);

    if (rows.length > 0) {
      const token = jwt.sign(
        { id: rows[0].id, email: rows[0].email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: '10h' }
      );



      return res.json({
        success: true,
        token,
        user: {
          email: rows[0].email,
          name: rows[0].name,
          role: "admin",
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid admin login details' });
    }
  } catch (err) {
    console.error('Database query error: ', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
};






const adminSignup = async (req, res) => {
  const { email, password } = req.body;

  const signupQuery = `
    INSERT INTO admins (email, password) VALUES (?, ?)
  `;

  try {
    const [result] = await db.execute(signupQuery, [email, password]);

    if (result.affectedRows > 0) {
      return res.status(201).json({ message: 'Account created successfully' });
    } else {
      return res.status(400).json({ message: 'Failed to create account' });
    }
  } catch (err) {
    console.error("Error inserting account:", err);
    return res.status(500).json({ message: 'Signup error' });
  }
};



module.exports = { editUser, login, createAccount, adminSignup, fetchUserDetails, deposit, withdraw, money_transfer };
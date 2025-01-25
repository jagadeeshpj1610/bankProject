const db = require('../models/db');


const createAccount = async (req, res) => {
  const { name, dob, balance, email, pan, aadhaar, phone, address, accountType } = req.body;

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

    res.status(201).json({ message: 'Account created successfully!', accountNumber, "accountNumber":accountNumber });
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

    return res.json({ userDetails, transactions, moneyTransfers });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch account details" });
  }
};


const deposit = async (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount) {
    return res.status(400).json({ error: "Account number and amount are required" });
  }

  try {
    const prevBalance = await db.query("SELECT balance, name FROM users WHERE account_number = ?", [accountNumber]);
    const depositQuery = "UPDATE users SET balance = balance + ? WHERE account_number = ?";
    const [result] = await db.query(depositQuery, [amount, accountNumber]);
    if (result.affectedRows > 0) {
      await db.query("INSERT INTO transactions (account_number, type, amount, timestamp, details) VALUES (?, ?, ?, NOW(), ?)", [accountNumber, "deposit", amount, "Deposit"]);
      const mainBalance = await db.query("SELECT balance FROM users WHERE account_number = ?", [accountNumber]);

      return res.json({ message: "Deposit successful", 'amount': amount, 'accountNumber': accountNumber, 'timestamp': new Date(), 'details': "Deposit", 'type': "deposit", "mainBalance": mainBalance, "prevBalance": prevBalance, "name": prevBalance[0][0].name });
    } else {
      return res.status(400).json({ error: "Failed to deposit" });
    }
  } catch (error) {
    console.error("Error depositing amount:", error);
    return res.status(500).json({ error: "Failed to deposit amount" })
  }
};




const withdraw = async (req, res) => {
  const { accountNumber, amount } = req.body;

  if (!accountNumber || !amount) {
    return res.status(400).json({ error: "Account number and amount are required" });
  }

  try {
    const prevBalance = await db.query("SELECT balance, name FROM users WHERE account_number = ?", [accountNumber]);
    const [user] = await db.query("SELECT * FROM users WHERE account_number = ?", [accountNumber]);
    if (user.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }

    const withdrawalAmount = parseFloat(amount);
    if (user[0].balance < withdrawalAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const withdrawQuery = "UPDATE users SET balance = balance - ? WHERE account_number = ?";
    const [result] = await db.query(withdrawQuery, [withdrawalAmount, accountNumber]);

    if (result.affectedRows > 0) {
      const transactionQuery = "INSERT INTO transactions (account_number, type, amount, timestamp, details) VALUES (?, ?, ?, NOW(), ?)";
      await db.query(transactionQuery, [accountNumber, "withdraw", withdrawalAmount, "Withdraw"]);
      const mainBalance = await db.query("SELECT balance FROM users WHERE account_number = ?", [accountNumber]);

      return res.json({ message: "Withdrawal successful" , 'amount': amount, 'accountNumber': accountNumber, 'timestamp': new Date(), "details": "Withdraw", "type": "withdraw", "mainBalance": mainBalance, "prevBalance": prevBalance, "name": prevBalance[0][0].name });
    } else {
      return res.status(400).json({ error: "Failed to withdraw" });
    }
  } catch (error) {
    console.error("Error withdrawing amount:", error);
    return res.status(500).json({ error: "Failed to withdraw amount" });
  }
};


const money_transfer = async (req, res) => {
  const { sender_account, receiver_account, amount } = req.body;
  if (!sender_account || !receiver_account || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const [sender] = await db.query("SELECT name FROM users WHERE account_number = ?", [sender_account]);
    const [receiver] = await db.query("SELECT name FROM users WHERE account_number = ?", [receiver_account]);
    if (sender.length === 0 || receiver.length === 0) {
      return res.status(404).json({ error: "Account not found" });
    }
    const transferAmount = parseFloat(amount);
    if (sender[0].balance < transferAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    const transferQuery = "INSERT INTO money_transfers (sender_account, receiver_account, amount, timestamp) VALUES (?, ?, ?, NOW())";
    await db.query(transferQuery, [sender_account, receiver_account, transferAmount]);
    const senderQuery = "UPDATE users SET balance = balance - ? WHERE account_number = ?";
    await db.query(senderQuery, [transferAmount, sender_account]);
    const receiverQuery = "UPDATE users SET balance = balance + ? WHERE account_number = ?";
    await db.query(receiverQuery, [transferAmount, receiver_account]);
    return res.json({ message: "Transfer successful", "senderName":sender.name, "sender_account": sender_account, "receiverName":receiver.name, "receiver_account":receiver_account, "tranferAmount":transferAmount, 'timestamp': new Date() , "details":"money tranfer", "type":"money_transfer", "senderDetails":sender, "receiverDetails":receiver });
  } catch (error) {
    console.error("Error transferring amount:", error);
    return res.status(500).json({ error: "Failed to transfer amount" });
  }
};



const login = async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM admins WHERE email = ? AND password = ?';

  try {
    const [rows] = await db.execute(query, [email, password]);

    if (rows.length > 0) {
      return res.json({ success: true, admin: rows[0] });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid login details' });
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



module.exports = { login, createAccount, adminSignup, fetchUserDetails, deposit, withdraw, money_transfer };
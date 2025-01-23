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

    res.status(201).json({ message: 'Account created successfully!', accountNumber });
  } catch (err) {
    console.error('Error creating account or transaction:', err);
    res.status(500).json({ message: 'Internal server error.' });
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



module.exports = { login, createAccount, adminSignup, fetchUserDetails };
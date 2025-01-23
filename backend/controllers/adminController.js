const db = require('../models/db');


const createAccount = (req, res) => {
  const { name, dob, balance, email } = req.body;

  if (!name || !dob || !balance || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking account:', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Account with this email already exists.' });
    }

    const accountNumber = `12340000${Math.floor(Math.random() * 10000)}`;

    const createQuery = 'INSERT INTO users (account_number, name, dob, balance, email) VALUES (?, ?, ?, ?, ?)';
    db.query(createQuery, [accountNumber, name, dob, balance, email], (err, result) => {
      if (err) {
        console.error('Error creating account:', err);
        return res.status(500).json({ message: 'Internal server error.' });
      }

      const transactionQuery = 'INSERT INTO transactions (account_number, type, amount, timestamp, details) VALUES (?, ?, ?, NOW(), ?)';
      db.query(transactionQuery, [accountNumber, 'deposit', balance, 'Initial deposit'], (err, result) => {
        if (err) {
          console.error('Error recording transaction:', err);
          return res.status(500).json({ message: 'Transaction error' });
        }
        res.status(201).json({ message: 'Account created successfully!', accountNumber });
      });
    });
  });
};

const fetchUserDetails = async (req, res) => {
  const accountNumber = req.query.accountNumber;

  if (!accountNumber) {
      return res.status(400).json({ error: "Account number is required" });
  }

  try {
      console.log("Received account number:", accountNumber);

      const userQuery = "SELECT * FROM users WHERE account_number = ?";
      const [userDetails] = await db.query(userQuery, [accountNumber]);
      console.log("User details:", userDetails);

      const transactionQuery = "SELECT * FROM transactions WHERE account_number = ?";
      const [transactions] = await db.query(transactionQuery, [accountNumber]);
      console.log("Transactions:", transactions);

      const transferQuery = "SELECT * FROM money_transfers WHERE sender_account = ? OR receiver_account = ?";
      const [moneyTransfers] = await db.query(transferQuery, [accountNumber, accountNumber]);
      console.log("Money transfers:", moneyTransfers);

      return res.json({ userDetails, transactions, moneyTransfers });
  } catch (error) {
      console.error("Error fetching account details:", error); // Log the exact error
      return res.status(500).json({ error: "Failed to fetch account details" });
  }
};





const login = ('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM admins WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Database query error: ', err);
      return res.status(500).json({ success: false, message: 'Database  error' });
    }

    if (result && result.length > 0) return res.json({ success: true, admin: result[0] });
    res.status(401).json({ success: false, message: 'Invalid login details' });
  });
});




module.exports = { login, createAccount, fetchUserDetails };
const db = require('../models/db');

const userSignup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  try {
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User does not exist in the bank system. Please contact admin." });
    }

    await db.query("INSERT INTO admins (email, password) VALUES (?, ?)", [email, password]);

    return res.json({ message: "Signup successful. You can now log in with your credentials." });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ error: "Failed to sign up" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [adminUser] = await db.query(
      "SELECT * FROM admins WHERE email = ? AND password = ?",
      [email, password]
    );

    if (adminUser.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      user: {
        email: adminUser[0].email,
        name: adminUser[0].name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserDetailsAndTransactions = async (req, res) => {
  const { email } = req.query;
  console.log("Received email:", email);

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
      'SELECT * FROM money_transfers WHERE sender_account = ? OR receiver_account = ?',
      [userDetails.account_number, userDetails.account_number]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for this account" });
    }

    const transactionsWithType = transactions.map(transaction => {
      const updatedTransaction = { ...transaction };
      updatedTransaction.type = transaction.sender_account === userDetails.account_number ? 'Debited' : 'Credited';
      return updatedTransaction;
    });

    return res.json({
      userDetails,
      transactions: transactionsWithType
    });

  } catch (error) {
    console.error("Error fetching user details or transactions:", error);
    return res.status(500).json({ error: "Failed to retrieve data" });
  }
};


module.exports = { userSignup, login, getUserDetailsAndTransactions };

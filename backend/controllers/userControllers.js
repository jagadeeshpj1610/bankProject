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
      user: adminUser[0],
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { userSignup, login };

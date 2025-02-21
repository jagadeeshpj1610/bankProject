const db = require('../config/db');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {

    const [rows] = await db.execute("SELECT * FROM admins WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Email not found" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    if (user.role === "user") {
      const emailContent = `Hello ${user.name},\n\nYou have successfully logged into your account.\n\nIf you did not initiate this login, please contact support at bank1234magadha@gmail.com immediately.\n\nThank you.`;

      try {
        await sendEmail(user.email, "Login Successful", emailContent);
      } catch (emailError) {
        console.error("Error sending login email:", emailError);
      }
    }

    return res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Database query error: ", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { login };

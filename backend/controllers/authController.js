const db = require('../models/db');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');
const bcrypt = require("bcrypt");



const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [userRows] = await db.execute("SELECT * FROM logins WHERE email = ?", [email]);
    if (userRows.length === 0) {
      return res.status(401).json({ success: false, message: "Email not found" });
    }

    const user = userRows[0];
    const isAdmin = user.role === 'admin';

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    if (!isAdmin) {
      const emailContent = `Hello,\n\nYou have successfully logged into your account.\n\nIf you did not initiate this login, please contact support at bank1234magadha@gmail.com immediately.\n\nThank you.`;
      (async () => {
        try {
          await sendEmail(user.email, "Login Successful", emailContent);
        } catch (emailError) {
          console.error("Error sending login email:", emailError);
        }
      })();
    }

    return res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: isAdmin ? "Admin" : user.name,
        isAdmin,
      },
    });
  } catch (err) {
    console.error("Database query error: ", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const userSignup = async (req, res) => {
  const {  email, password } = req.body;

  if ( !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User does not exist in the bank system. Please contact admin." });
    }

    const [existingSignup] = await db.query("SELECT * FROM logins WHERE email = ?", [email]);
    if (existingSignup.length > 0) {
      return res.status(400).json({ error: "You have already signed up. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO logins (email, password, role) VALUES (?, ?, 'user')", [email, hashedPassword]);

    const emailContent = `Hello new bank customer\n\nYour account has been successfully created in Magadha bank.\n\nYou can now log in using your credentials.\n\nThank you for choosing our services.`;
    (async () => {
      try {
        await sendEmail(email, "Account Created Successfully", emailContent);
      } catch (emailError) {
        console.error("Error sending signup email:", emailError);
      }
    })();

    return res.json({ message: "Signup successful. You can now log in with your credentials." });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Failed to sign up" });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
      const [existingUser] = await db.query("SELECT * FROM logins WHERE email = ?", [email]);
      if (existingUser.length === 0) {
          return res.status(404).json({ error: "User does not exist. Please sign up first." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires_at = new Date(Date.now() + 2 * 60000);

      await db.query("DELETE FROM password_reset WHERE email = ?", [email]);
      await db.query("INSERT INTO password_reset (email, otp, expires_at) VALUES (?, ?, ?)", [email, otp, expires_at]);

      const emailContent = `Hello,\n\nYou have requested to reset your password. Please use the following OTP to reset your password: ${otp}\n\nThis OTP will expire in 2 minutes.\n\nThank you.`;
      (async () => {
        try {
          await sendEmail(email, "Password Reset", emailContent);
        } catch (emailError) {
          console.error("Error sending reset password email:", emailError);
        }
      })();

      res.json({ message: "OTP sent successfully." });
  } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
  }
};


const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
      const [results] = await db.query("SELECT * FROM password_reset WHERE email = ? AND otp = ? AND expires_at > NOW()", [email, otp]);
      if (results.length === 0) {
          return res.status(400).json({ error: "Invalid or expired OTP." });
      }

      res.json({ message: "OTP verified. You can reset your password now." });
  } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "OTP verification failed" });
  }
};


const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query("UPDATE logins SET password = ? WHERE email = ?", [hashedPassword, email]);
      await db.query("DELETE FROM password_reset WHERE email = ?", [email]);

      res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
      console.error("Reset Password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
  }
};

module.exports = { login, userSignup, sendOtp, verifyOtp, resetPassword };

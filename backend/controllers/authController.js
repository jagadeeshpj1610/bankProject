const db = require('../models/db');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');
const bcrypt = require("bcrypt");


// const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {

//     const [rows] = await db.execute("SELECT * FROM admins WHERE email = ?", [email]);

//     if (rows.length === 0) {
//       return res.status(401).json({ success: false, message: "Email not found" });
//     }

//     const user = rows[0];

//     if (user.password !== password) {
//       return res.status(401).json({ success: false, message: "Invalid password" });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "10h" }
//     );

//     if (user.role === "user") {
//       const emailContent = `Hello ${user.name},\n\nYou have successfully logged into your account.\n\nIf you did not initiate this login, please contact support at bank1234magadha@gmail.com immediately.\n\nThank you.`;

//       (async () => {
//         try {
//           await sendEmail(user.email, "Login Successful", emailContent);
//         } catch (emailError) {
//           console.error("Error sending login email:", emailError);
//         }
//       })();
//     }

//     return res.json({
//       success: true,
//       token,
//       user: {
//         email: user.email,
//         name: user.name,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Database query error: ", err);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


// const userSignup = async (req, res) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   try {
//     const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

//     if (existingUser.length === 0) {
//       return res.status(404).json({ error: "User does not exist in the bank system. Please contact admin." });
//     }

//     const [existingSignup] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);

//     if (existingSignup.length > 0) {
//       return res.status(400).json({ error: "You have already signed up. Please log in." });
//     }

//     await db.query("INSERT INTO admins (name, email, password) VALUES (?, ?, ?)", [name, email, password]);

//     const emailContent = `Hello ${name},\n\nYour account has been successfully created in Magadha bank.\n\nYou can now log in using your credentials.\n\nThank you for choosing our services.`;


//     (async () => {
//       try {
//         await sendEmail(email, "Account Created Successfully", emailContent);
//       } catch (emailError) {
//         console.error("Error sending signup email:", emailError);
//       }
//     })();

//     return res.json({ message: "Signup successful. You can now log in with your credentials." });
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to sign up" });
//   }
// };



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

module.exports = { login, userSignup };

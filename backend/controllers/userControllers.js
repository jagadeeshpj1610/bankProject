const db = require('../models/db');
const jwt = require('jsonwebtoken');
const { moneyTransferSenderTemplate, moneyTransferReceiverTemplate } = require('../utils/emailtemplates')
const sendEmail = require('../utils/emailService');

const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name, !email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    console.log(existingUser.length);


    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User does not exist in the bank system. Please contact admin." });
    }

    const [existingSignup] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);

    console.log(existingSignup.length);

    if (existingSignup.length > 0) {
      return res.status(400).json({ error: "You have already signed up. Please log in." });
    }

    await db.query("INSERT INTO admins (name, email, password) VALUES (?, ?, ?)", [name, email, password]);

    const emailContent = `Hello ${name},\n\nYour account has been successfully created in Magadha bank.\n\nYou can now log in using your credentials.\n\nThank you for choosing our services.`;
    await sendEmail(email, "Account Created Successfully", emailContent);

    return res.json({ message: "Signup successful. You can now log in with your credentials." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to sign up" });
  }
};


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

    const emailContent = `Hello ${user.name},\n\nYou have successfully logged into your account.\n\nIf you did not initiate this login, please contact support to bank1234magadha@gmail.com immediately.\n\nThank you.`;
    await sendEmail(user.email, "Login Successful", emailContent);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    return res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        role: "user",
      },
    });
  } catch (err) {
    console.error("Database query error: ", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const getUserDetailsAndTransactions = async (req, res) => {
  const { email } = req.query;

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


    const accountNumbers = transactions.map((t) => t.receiver_account);
    const [receivers] = await db.query(
      `SELECT account_number, name FROM users WHERE account_number IN (?)`,
      [accountNumbers]
    );


    const receiverNameMap = receivers.reduce((acc, receiver) => {
      acc[receiver.account_number] = receiver.name;
      return acc;
    }, {});


    const transactionsWithDetails = transactions.map((transaction) => {
      const updatedTransaction = { ...transaction };
      updatedTransaction.type =
        transaction.sender_account === userDetails.account_number ? "Debited" : "Credited";
      updatedTransaction.receiver_name =
        receiverNameMap[transaction.receiver_account] || "Unknown";
      return updatedTransaction;
    });

    return res.json({
      userDetails,
      transactions: transactionsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching user details or transactions:", error);
    return res.status(500).json({ error: "Failed to retrieve data" });
  }
};


const money_transfer = async (req, res) => {
  const { sender_account, receiver_account, amount } = req.body;

  if (!sender_account || !receiver_account || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (sender_account === receiver_account) {
    return res.status(400).json({ error: "Sender and receiver account numbers cannot be the same" });
  }

  try {
    const [senderDetails] = await db.query("SELECT * FROM users WHERE account_number = ?", [sender_account]);
    const [receiverDetails] = await db.query("SELECT * FROM users WHERE account_number = ?", [receiver_account]);

    if (senderDetails.length === 0 || receiverDetails.length === 0) {
      return res.status(404).json({ error: "Receiver account not found" });
    }

    const senderBalance = parseFloat(senderDetails[0].balance);
    const transferAmount = parseFloat(amount);

    if (senderBalance <= 0) {
      return res.status(400).json({ error: "Sender account has insufficient balance for any transaction" });
    }

    if (senderBalance < transferAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const [resultSender] = await db.query("UPDATE users SET balance = balance - ? WHERE account_number = ?", [transferAmount, sender_account]);
    const [resultReceiver] = await db.query("UPDATE users SET balance = balance + ? WHERE account_number = ?", [transferAmount, receiver_account]);

    const [currentSenderBalance] = await db.query("SELECT balance FROM users WHERE account_number = ? ", [sender_account]);

    if (resultSender.affectedRows > 0 && resultReceiver.affectedRows > 0) {
      await db.query("INSERT INTO money_transfers (sender_account, receiver_account, amount, timestamp) VALUES (?, ?, ?, NOW())", [sender_account, receiver_account, transferAmount]);

      if (senderDetails[0].email) {
        const senderEmailContent = moneyTransferSenderTemplate({
          sender_name: senderDetails[0].name,
          receiver_name: receiverDetails[0].name,
          receiver_account,
          amount: transferAmount,
          newBalance: currentSenderBalance[0].balance,
        });
        await sendEmail(senderDetails[0].email, senderEmailContent.subject, senderEmailContent.text);
      }

      if (receiverDetails[0].email) {
        const receiverEmailContent = moneyTransferReceiverTemplate({
          receiver_name: receiverDetails[0].name,
          sender_name: senderDetails[0].name,
          sender_account,
          amount: transferAmount,
          newBalance: receiverDetails[0].balance + transferAmount,
        });
        await sendEmail(receiverDetails[0].email, receiverEmailContent.subject, receiverEmailContent.text);
      }

      return res.json({
        message: "Transfer successful",
        sender_account,
        senderDetails: senderDetails[0],
        receiver_account,
        receiverDetails: receiverDetails[0],
        transferAmount,
        timestamp: new Date(),
        senderBalance: currentSenderBalance[0].balance,
      });
    } else {
      return res.status(400).json({ error: "Failed to transfer amount" });
    }
  } catch (error) {
    console.error("Error transferring amount:", error);
    return res.status(500).json({ error: "Failed to transfer amount" });
  }
};






module.exports = { userSignup, login, getUserDetailsAndTransactions,  money_transfer };

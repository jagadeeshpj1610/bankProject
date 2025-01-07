// controllers/adminController.js

const db = require('../connection/db');

exports.login = (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM admins WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.length > 0) {
      return res.json({ success: true, admin: result[0] });
    }
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  });
};

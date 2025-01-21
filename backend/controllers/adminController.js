const db = require('../models/db');


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

module.exports = { login };
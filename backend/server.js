const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

db.connect(() => {
  console.log('Connected to the MySQL database');
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM admins WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Database query error: ', err);
      return res.status(500).json({ success: false, message: 'Database query error' });
    }

    if (result && result.length > 0) return res.json({ success: true, admin: result[0] });
    res.status(401).json({ success: false, message: 'Invalid login details' });
  });
});

app.listen(8000, () => {
  console.log('Server running at http://localhost:8000');

});



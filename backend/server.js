const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jagadeesh@1610',
  database: 'bank_app',
});

db.connect(() => {
  console.log('Connected to the MySQL database');
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM admins WHERE email = ? AND password = ?';
  db.query(query, [email, password], ( result) => {

    if (result.length > 0) return res.json({ success: true, admin: result[0] });
    res.status(401).json({ success: false, message: 'Invalid login details' });
  });
});

app.listen(8000, () => {
  console.log('Server running at http://localhost:8000');
});

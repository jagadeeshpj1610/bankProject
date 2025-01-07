const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Jagadeesh@1610',
  database: 'bank_app',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the MySQL database!');
});

module.exports = db;
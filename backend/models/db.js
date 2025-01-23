
// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the MySQL database:', err);
//     return;
//   }
//   console.log('Connected to the MySQL database');
// });

// module.exports = db;

const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to the MySQL database');
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
  }
})();

module.exports = db;


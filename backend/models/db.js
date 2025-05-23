const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to the MySQL database');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
  }
})();

module.exports = db;


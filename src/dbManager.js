const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    },
    console.log(`Attempting to connect to the ${process.env.DB_NAME} database.\n`)
  );

// Run test query to see if database is connected
db.query('SELECT 1+1 as test1', (err, result) => {
  if (err) {
    console.log('\n\nDatabase connection failed. Please check that staff_db exists in your MySQL server and that credentials are correct.')
    process.exit();
  }
});

module.exports = db;
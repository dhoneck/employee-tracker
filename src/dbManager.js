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
  // If the query has an error let the user know and exit the app
  if (err) {
    console.log('\n\nDatabase connection failed.');
    console.log(`Check that 'staff_db' exists in your MySQL server and that credentials are correct in your .env file.`);
    console.log(`Try running 'source schema.sql' in MySQL to create the database and tables.`);
    console.log('Quitting the application.');
    db.end();
    process.exit();
  }
});

module.exports = db;
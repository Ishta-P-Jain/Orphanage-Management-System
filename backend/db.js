// ============================================
//  db.js — MySQL Database Connection
//  Uses a connection pool for better performance
// ============================================

const mysql = require('mysql2');
require('dotenv').config();

// Create a pool of connections (more efficient than a single connection)
const pool = mysql.createPool({
  host:             process.env.DB_HOST,
  user:             process.env.DB_USER,
  password:         process.env.DB_PASSWORD,
  database:         process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:  10,   // max 10 simultaneous connections
});

// Export as promise-based pool so we can use async/await throughout the app
module.exports = pool.promise();

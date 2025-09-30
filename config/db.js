const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "mysql-30d2e1d7-givendarian-74a9.g.aivencloud.com",
  user: "avnadmin",
  password: process.env.DB_PASSWORD,
  database: "GivethStation",
  port: 25879,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); // simple ping to check connectivity
    connection.release();
    console.log(`[${new Date().toLocaleString("en-UG")}] ✅ MySQL connected successfully`);
  } catch (err) {
    console.error(`[${new Date().toLocaleString("en-UG")}] ❌ MySQL connection failed:`, err.message);
    process.exit(1); // optional: stop server if DB is down
  }
}

// Immediately test connection on startup
testConnection();

module.exports = pool;

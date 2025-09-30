const pool = require("../config/db");
const { DateTime } = require("luxon");

// Function to ensure logs table exists
async function ensureLogsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      clerk_id VARCHAR(255) NOT NULL,
      route VARCHAR(255) NOT NULL,
      method VARCHAR(10) NOT NULL,
      timestamp DATETIME NOT NULL
    )
  `;
  await pool.query(query);
}

// Function to insert a log entry
async function logRequest({ clerkID, route, method }) {
  await ensureLogsTable(); // ensures table exists

  // Uganda time UTC+3
  const ugandaTime = DateTime.now().setZone("Africa/Kampala").toSQL({ includeOffset: false });

  const insertQuery = `
    INSERT INTO logs (clerk_id, route, method, timestamp)
    VALUES (?, ?, ?, ?)
  `;
  await pool.query(insertQuery, [clerkID, route, method, ugandaTime]);
}

module.exports = { logRequest };

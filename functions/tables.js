// functions/tables.js
const pool = require("../config/db");

async function initTables() {
  try {
    // Favorites Table (clerk_id + imdb_id unique)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) NOT NULL,
        imdb_id VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(clerk_id, imdb_id)
      )
    `);

    // History Table (no UNIQUE because user can watch same imdb_id multiple times)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS history (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) NOT NULL,
        imdb_id VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Favorites & History tables checked/created.");
  } catch (err) {
    console.error("❌ Error initializing tables:", err);
  }
}

module.exports = initTables;

const pool = require("../config/db");

async function removeDuplicateHistory() {
  try {
    // Find duplicates: same clerk_id and imdb_id with count > 1
    const [duplicates] = await pool.query(`
      SELECT clerk_id, imdb_id, MIN(id) as keep_id
      FROM history
      GROUP BY clerk_id, imdb_id
      HAVING COUNT(*) > 1
    `);

    for (const dup of duplicates) {
      // Delete all rows with the same clerk_id and imdb_id except the one to keep
      await pool.query(
        `DELETE FROM history WHERE clerk_id = ? AND imdb_id = ? AND id != ?`,
        [dup.clerk_id, dup.imdb_id, dup.keep_id]
      );
    }

    if (duplicates.length > 0) {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Removed duplicate history entries`);
    }
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] ❌ Error removing duplicates:`, err.message);
  }
}

// Run every 3 seconds
setInterval(removeDuplicateHistory, 3000);

module.exports = removeDuplicateHistory;

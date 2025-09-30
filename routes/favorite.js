// routes/favorites.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Add to favorites
router.post("/", async (req, res) => {
  const { clerk_id, imdb_id } = req.body;
  try {
    await pool.query(
    `INSERT IGNORE INTO favorites (clerk_id, imdb_id) VALUES (?, ?)`,
    [clerk_id, imdb_id]
    );

    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get favorites
router.get("/:clerk_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM favorites WHERE clerk_id = ? ORDER BY created_at DESC`,
      [req.params.clerk_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Remove from favorites
router.delete("/:clerk_id/:imdb_id", async (req, res) => {
  const { clerk_id, imdb_id } = req.params;
  try {
    const [result] = await pool.query(
      `DELETE FROM favorites WHERE clerk_id = ? AND imdb_id = ?`,
      [clerk_id, imdb_id]
    );

    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

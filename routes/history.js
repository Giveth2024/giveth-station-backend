// routes/history.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Add to history
router.post("/", async (req, res) => {
  const { clerk_id, imdb_id } = req.body;
  try {
    // Check if this record already exists
    const [existing] = await pool.query(
      "SELECT id FROM history WHERE clerk_id = ? AND imdb_id = ?",
      [clerk_id, imdb_id]
    );

    if (existing.length > 0) {
      return res.json({ success: false, message: "Already in history" });
    }

    // Insert if not exists
    await pool.query(
      "INSERT INTO history (clerk_id, imdb_id) VALUES (?, ?)",
      [clerk_id, imdb_id]
    );

    res.json({ success: true, message: "Added to history" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get history
router.get("/:clerk_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM history WHERE clerk_id = ? ORDER BY created_at DESC",
      [req.params.clerk_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete single history entry
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM history WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "History item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all history for a user
router.delete("/clear/:clerk_id", async (req, res) => {
  try {
    await pool.query("DELETE FROM history WHERE clerk_id = ?", [req.params.clerk_id]);
    res.json({ success: true, message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

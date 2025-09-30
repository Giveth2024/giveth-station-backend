const express = require("express");
const router = express.Router();
const { searchOMDb, getDetails } = require("../functions/omdbFetch");

router.get("/search", async (req, res) => {
  const { s, type = "movie", page = 1 } = req.query;
  if (!s) return res.status(400).json({ error: "Missing search query" });

  try {
    const data = await searchOMDb(s, type, page);
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/details", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing imdbID" });

  try {
    const data = await getDetails(id);
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

// Check cache, fetch if missing
router.get("/", async (req, res) => {
  const { id, type } = req.query;
  const clerkID = req.header("x-clerk-id");

  if (!clerkID) return res.status(403).json({ error: "Missing ClerkID" });
  if (!id) return res.status(400).json({ error: "Missing media id" });


  try {
    let media;
      // Fetch from OMDb
      const { data } = await axios.get("https://www.omdbapi.com/", {
        params: { apikey: OMDB_API_KEY, i: id, plot: "full", r: "json" },
      });


      if (data.Response === "False") {
        return res.status(404).json({ error: "Media not found" });
      }

      media = data;

    res.json({ media });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

module.exports = router;

const express = require("express")
const db = require("../config/db.js")

const router = express.Router()

// GET all TV data
router.get("/", async (req, res) => {
  try {
    // Fetch from givethtv
    const [givethtv] = await db.query(
      "SELECT name, url FROM givethtv"
    )

    // Fetch from thetvapp
    const [thetvapp] = await db.query(
      "SELECT tvg_name AS name, stream_url AS url FROM thetvapp"
    )

    res.json({
      givethtv,
      thetvapp
    })
  } catch (err) {
    console.error("❌ Error fetching TV data:", err)
    res.status(500).json({ error: "Failed to fetch TV data" })
  }
})

module.exports = router

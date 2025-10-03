const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const db = require("./config/db");

const routes = require("./routes/index");
const logger = require("./middleware/logger");
const limiter = require("./middleware/rateLimiter");
const checkClerk = require("./middleware/checkClerk");
const logRequests = require("./middleware/logRequests");
const checkInternet = require("./middleware/checkInternet");

const playerRoute = require("./routes/player");
const initTables = require("./functions/tables");
const historyRoutes = require("./routes/history");
const favoriteRoutes = require("./routes/favorite");
const tvRoutes = require("./routes/tv.js")

const removeDuplicateHistory = require("./functions/duplicateDelete");

const app = express();
const PORT = process.env.PORT || 5000;

// Apply before all routes that need internet
app.use(checkInternet);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(logger);
app.use(checkClerk); // <-- must be after logger but before routes
app.use(logRequests); // logs requests to MySQL
app.use(routes);

app.use("/api/player", playerRoute);
app.use("/api/tv", tvRoutes)

initTables();

// Start duplicate cleaner
removeDuplicateHistory(); // starts interval internally

app.use("/api/history", historyRoutes);
app.use("/api/favorite", favoriteRoutes)

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

app.get("/api/proxy", async (req, res) => {
  try {
    const { url } = req.query
    if (!url) return res.status(400).json({ error: "Missing url param" })

    // First request -> tvpass.org
    const firstResp = await axios.get(url, {
      maxRedirects: 0, // don't follow, we want the redirect target
      validateStatus: (status) => status >= 200 && status < 400
    })

    // Grab the actual resolved URL (redirect location)
    const proxyUrl =
      firstResp.request.res.responseUrl || firstResp.headers.location

    console.log("🎯 Proxy M3U8 URL:", proxyUrl)

    // Now fetch the actual m3u8 file
    const secondResp = await axios.get(proxyUrl, { responseType: "text" })
    console.log("=== M3U8 Playlist (first 300 chars) ===")
    console.log(secondResp.data.substring(0, 300))

    // Return both to client
    res.json({
      proxyUrl,
      playlist: secondResp.data
    })
  } catch (err) {
    console.error("❌ Error:", err.message)
    res.status(500).json({ error: err.message })
  }
})



// Catch-all
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

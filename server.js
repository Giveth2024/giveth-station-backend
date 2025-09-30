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

initTables();

// Start duplicate cleaner
removeDuplicateHistory(); // starts interval internally

app.use("/api/history", historyRoutes);
app.use("/api/favorite", favoriteRoutes)


// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});


// Catch-all
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

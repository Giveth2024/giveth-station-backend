// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 60 // 60 requests per IP per minute
});
const helmet = require('helmet');
app.use(helmet());


app.use(limiter);


app.use(cors());
app.use(express.json());

// Proxy route to OMDb search
app.get("/api/search", async (req, res) => {

  const { s, type = "movie", page = 1 } = req.query;
  if (!s) return res.status(400).json({ error: "Missing search query" });

  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY,
        s,
        type,
        page,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Proxy route to OMDb details
app.get("/api/details", async (req, res) => {
  const { id } = req.query;
//   console.log("OMDb Key:", OMDB_API_KEY);

  if (!id) return res.status(400).json({ error: "Missing imdbID" });

  try {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: OMDB_API_KEY,
        i: id,
        plot: "short",
        r: "json",
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});

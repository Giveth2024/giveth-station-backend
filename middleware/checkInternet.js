const dns = require("dns");

async function checkInternet(req, res, next) {
  // Skip static files or internal routes if you want
  // Example: if (req.originalUrl === "/") return next();

  dns.lookup("google.com", (err) => {
    if (err && err.code === "ENOTFOUND") {
      console.log(`[${new Date().toISOString()}] No internet access detected`);
      return res.status(503).json({ error: "No internet access. Please try again later." });
    }
    next();
  });
}

module.exports = checkInternet;

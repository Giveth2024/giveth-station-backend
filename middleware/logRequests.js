const { logRequest } = require("../functions/dbInit");

module.exports = async (req, res, next) => {
  const clerkID = req.headers["x-clerk-id"] || "Unknown";

  // Only log if ClerkID exists
  if (clerkID !== "Unknown") {
    try {
      await logRequest({ clerkID, route: req.originalUrl, method: req.method });
    } catch (err) {
      console.error("Error logging request:", err);
    }
  }

  next();
};

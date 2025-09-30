// Logs every request with timestamp and Clerk ID from frontend
module.exports = (req, res, next) => {
  const clerkID = req.headers["x-clerk-id"] || "Unknown";
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | ClerkID: ${clerkID}`);
  next();
};

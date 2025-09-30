module.exports = (req, res, next) => {
    // Exclude health-check root endpoint
  if (req.originalUrl === "/") return next();
  
  const clerkID = req.headers["x-clerk-id"];
  
  if (!clerkID) {
    console.warn(`[${new Date().toISOString()}] Blocked request: Missing ClerkID | ${req.method} ${req.originalUrl}`);
    return res.status(403).json({ error: "Forbidden: Missing ClerkID" });
  }

  // Attach ClerkID to req object for later use if needed
  req.clerkID = clerkID;

  next();
};

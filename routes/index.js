const express = require("express");
const router = express.Router();
const omdbRoutes = require("./omdb");


router.use("/api", omdbRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");

router.use("/", userRoutes);
router.use("/", clothingItemRoutes);

module.exports = router;

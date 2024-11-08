const express = require("express");

const router = express.Router();

const userRoutes = require("./users");

const clothingItemRoutes = require("./clothingItems");

const ERROR_CODES = require("../utils/errors");

const auth = require("../middlewares/auth");

router.use(auth);

router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

router.use((req, res) => {
  console.error();
  res
    .status(ERROR_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

module.exports = router;

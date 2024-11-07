const express = require("express");

const router = express.Router();

const userRoutes = require("./users");

const clothingItemRoutes = require("./clothingItems");

const ERROR_CODES = require("../utils/errors");

// router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);
router.post("/signin", login);
router.post("signup", createUser);

router.use((req, res) => {
  console.error();
  res
    .status(ERROR_CODES.NOT_FOUND)
    .json({ message: "Requested resource not found" });
});

module.exports = router;

const express = require("express");

const router = express.Router();

const userRoutes = require("./users");

const clothingItemRoutes = require("./clothingItems");

const {
  validateUserSignup,
  validateUserLogin,
} = require("../middlewares/validation");

const { login, createUser } = require("../controllers/users");

// const ERROR_CODES = require("../utils/errors");
const NotFoundError = require("../utils/errors/NotFoundError");

router.use("/", userRoutes);
router.use("/items", clothingItemRoutes);

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserSignup, createUser);

router.use((req, res) => {
  console.error();
  // res
  //   .status(ERROR_CODES.NOT_FOUND)
  //   .json({ message: "Requested resource not found" });
  return next(new NotFoundError("Requested resource not found."));
});

module.exports = router;

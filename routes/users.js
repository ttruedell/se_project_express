const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

const auth = require("../middlewares/auth");

const { validateProfileUpdate } = require("../middlewares/validation");

router.get("/users/me", auth, usersController.getCurrentUser);
router.patch(
  "/users/me",
  auth,
  validateProfileUpdate,
  usersController.updateUserData
);

module.exports = router;

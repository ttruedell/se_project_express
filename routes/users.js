const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

const auth = require("../middlewares/auth");

router.get("/users/me", auth, usersController.getCurrentUser);
router.patch("/users/me", auth, usersController.updateUserData);

module.exports = router;

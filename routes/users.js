const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

const auth = require("../middlewares/auth");

// router.use(auth);

// router.get("/", usersController.getUsers);
// router.get("/:userId", usersController.getUser);
router.post("/", usersController.createUser);
router.get("/users/me", auth, usersController.getCurrentUser);
router.patch("/users/me", auth, usersController.updateUserData);

module.exports = router;

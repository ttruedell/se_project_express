const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

router.get("/users", usersController.getUsers);
router.get("/users/:userId", usersController.getUser);
router.post("/users", usersController.createUser);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;

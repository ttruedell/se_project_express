const express = require("express");

const router = express.Router();

const usersController = require("../controllers/users");

router.get("/", usersController.getUsers);
router.get("/:userId", usersController.getUser);
router.post("/", usersController.createUser);

router.use((req, res) => {
  console.error();
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;

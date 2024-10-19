const express = require("express");

const router = express.Router();

const clothingItemController = require("../controllers/clothingItems");

router.get("/items", clothingItemController.getCards);
router.post("/items", clothingItemController.createClothingItem);
router.delete("/items/:itemId", clothingItemController.deleteClothingItem);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;

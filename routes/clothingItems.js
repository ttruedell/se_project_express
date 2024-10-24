const express = require("express");

const router = express.Router();

const clothingItemsController = require("../controllers/clothingItems");

router.get("/", clothingItemsController.getClothingItems);
router.post("/", clothingItemsController.createClothingItem);
router.delete("/:itemId", clothingItemsController.deleteClothingItem);

router.put("/:itemId/likes", clothingItemsController.likeItem);
router.delete("/:itemId/likes", clothingItemsController.dislikeItem);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;

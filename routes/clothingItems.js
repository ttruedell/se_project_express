const express = require("express");

const router = express.Router();

const clothingItemsController = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

// router.use(auth);

router.get("/", clothingItemsController.getClothingItems);
router.post("/", auth, clothingItemsController.createClothingItem);
router.delete("/:itemId", auth, clothingItemsController.deleteClothingItem);

router.put("/:itemId/likes", auth, clothingItemsController.likeItem);
router.delete("/:itemId/likes", auth, clothingItemsController.dislikeItem);

module.exports = router;

const express = require("express");

const router = express.Router();

const {
  validateClothingItem,
  validateId,
} = require("../middlewares/validation");

const clothingItemsController = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

router.get("/", clothingItemsController.getClothingItems);
router.post(
  "/",
  auth,
  validateClothingItem,
  clothingItemsController.createClothingItem
);
router.delete(
  "/:itemId",
  auth,
  validateId,
  clothingItemsController.deleteClothingItem
);

router.put(
  "/:itemId/likes",
  auth,
  validateId,
  clothingItemsController.likeItem
);
router.delete(
  "/:itemId/likes",
  auth,
  validateId,
  clothingItemsController.dislikeItem
);

module.exports = router;

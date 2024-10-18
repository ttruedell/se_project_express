const express = require("express");

const router = express.Router();

const ClothingItem = require("../models]/clothingItem");

const getCards = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find();
    res.status(200).json(clothingItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cloting items" });
  }
};

const createClothingItem = async (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;
  try {
    const newClothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner,
    });
    await newClothingItem.save();
    res.status(201).json(newClothingItem);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating clothing item", error: error.message });
  }
};

const deleteClothingItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const deletedClothingItem = await ClothingItem.findByIdAndDelete(itemId);
    if (!deletedClothingItem) {
      return res.status(404).json({ message: "Clothing item not found" });
    }
    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cloting items" });
  }
};

router.get("/items", getCards);
router.post("/items", createClothingItem);
router.delete("/items/:itemId", deleteClothingItem);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;

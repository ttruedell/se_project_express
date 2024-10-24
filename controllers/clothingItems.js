const ClothingItem = require("../models/clothingItem");

const ERROR_CODES = require("../utils/errors");

module.exports.getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find().orFail(() => {
      const error = new Error("Clothin item ID not found.");
      error.statusCode = 404;
      throw error;
    });

    return res.status(200).json(clothingItems);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message ${error.message} has occurred while executing the code`
    );
    if (error.statusCode) {
      return res.status(error.statusCode).send({ message: error.message });
    }

    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.createClothingItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const newClothingItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner,
    });
    await newClothingItem.save();
    return res.status(201).json(newClothingItem);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid data provided." });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.deleteClothingItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    const deletedClothingItem = await ClothingItem.findByIdAndDelete(itemId);
    if (!deletedClothingItem) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Clothing item not found." });
    }
    return res
      .status(200)
      .json({ message: "Clothing item deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.likeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Clothing item not found." });
    }
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message ${error.message} has occurred while executing the code`
    );
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.dislikeItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "Clothing item not found." });
    }
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error(
      `Error ${error.name} with the message ${error.message} has occurred while executing the code`
    );
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

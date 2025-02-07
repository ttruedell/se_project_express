const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");

// const ERROR_CODES = require("../utils/errors");

// const {
//   RequestSuccess,
//   ResourceCreated,
//   BadRequestError,
//   // UnauthorizedError,
//   ForbiddenError,
//   NotFoundError,
//   // ConflictError,
// } = require("../utils/customErrors");

const RequestSuccess = require("../utils/errors/RequestSuccess");
const ResourceCreated = require("../utils/errors/ResourceCreated");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");

module.exports.getClothingItems = async (req, res, next) => {
  try {
    const clothingItems = await ClothingItem.find();

    return res.status(RequestSuccess).json(clothingItems);
  } catch (error) {
    // console.error(
    //   `Error ${error.name} with the message ${error.message} has occurred while executing the code`
    // );

    // return res
    //   .status(ERROR_CODES.SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server." });
    return next(error);
  }
};

module.exports.createClothingItem = async (req, res, next) => {
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
    return res
      .status(/* ERROR_CODES.CREATED */ ResourceCreated)
      .json(newClothingItem);
  } catch (error) {
    // console.error(error);
    if (error.name === "ValidationError") {
      // return res
      //   .status(ERROR_CODES.BAD_REQUEST)
      //   .send({ message: "Invalid data provided." });
      return next(new BadRequestError("Invalid data provided."));
    }
    // return res
    //   .status(ERROR_CODES.SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server." });

    return next(error);
  }
};

module.exports.deleteClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  const owner = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    // return res
    //   .status(ERROR_CODES.BAD_REQUEST)
    //   .send({ message: "Invalid item ID format." });
    return next(new BadRequestError("Invalid item ID format."));
  }

  try {
    const clothingItem = await ClothingItem.findById(itemId);

    if (!clothingItem) {
      // return res
      //   .status(ERROR_CODES.NOT_FOUND)
      //   .send({ message: "Clothing item not found." });
      return next(new NotFoundError("Clothing item not found."));
    }

    if (!clothingItem.owner.equals(owner)) {
      // return res
      //   .status(ERROR_CODES.FORBIDDEN)
      //   .send({ message: "You do not have permission to delete this item." });
      return next(
        new ForbiddenError("You do not have permission to delete this item.")
      );
    }

    await ClothingItem.findByIdAndDelete(itemId);

    return res
      .status(RequestSuccess)
      .json({ message: "Clothing item deleted successfully." });
  } catch (error) {
    // console.error(error);
    // return res
    //   .status(ERROR_CODES.SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server." });
    return next(error);
  }
};

module.exports.likeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    // return res
    //   .status(ERROR_CODES.BAD_REQUEST)
    //   .send({ message: "Invalid item ID format." });
    return next(new BadRequestError("Invalid item ID format."));
  }

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!updatedItem) {
      // return res
      //   .status(ERROR_CODES.NOT_FOUND)
      //   .send({ message: "Clothing item not found." });
      return next(new NotFoundError("Clothing item not found."));
    }
    return res.status(RequestSuccess).json(updatedItem);
  } catch (error) {
    // console.error(
    //   `Error ${error.name} with the message ${error.message} has occurred while executing the code`
    // );
    // return res
    //   .status(ERROR_CODES.SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server." });
    return next(error);
  }
};

module.exports.dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    // return res
    //   .status(ERROR_CODES.BAD_REQUEST)
    //   .send({ message: "Invalid item ID format." });
    return next(new BadRequestError("Invalid item ID format."));
  }

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!updatedItem) {
      // return res
      //   .status(ERROR_CODES.NOT_FOUND)
      //   .send({ message: "Clothing item not found." });
      return next(new NotFoundError("Clothing item not found."));
    }
    return res.status(RequestSuccess).json(updatedItem);
  } catch (error) {
    // console.error(
    //   `Error ${error.name} with the message ${error.message} has occurred while executing the code`
    // );
    // return res
    //   .status(ERROR_CODES.SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server." });
    return next(error);
  }
};

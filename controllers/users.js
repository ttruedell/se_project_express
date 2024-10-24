const User = require("../models/user");

const ERROR_CODES = require("../utils/errors");

const mongoose = require("mongoose");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "Error fetching users." });
  }
};

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid user ID format." });
  }

  try {
    const user = await User.findById(userId).orFail(() => {
      const error = new Error("User ID not found.");
      error.statusCode = 404;
      throw error;
    });

    return res.status(200).json(user);
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

module.exports.createUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const newUser = new User({ name, avatar });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid data provided." });
    } else if (error.name === "MongoError" && error.code === 11000) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "User already exists." });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

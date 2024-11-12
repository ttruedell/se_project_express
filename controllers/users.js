const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const validator = require("validator");

const JWT_SECRET = require("../utils/config");

const User = require("../models/user");

const ERROR_CODES = require("../utils/errors");

module.exports.getCurrentUser = async (req, res) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Invalid user ID format." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "User not found." });
    }

    return res.status(ERROR_CODES.OK).json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
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
  const { name, avatar, email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res
      .status(ERROR_CODES.CONFLICT)
      .send({ message: "Invalid email provided." });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send({ message: "User already exists." });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    return res.status(ERROR_CODES.CREATED).json({
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "Invalid data provided." });
    }

    // if (error.name === "MongoError" && error.code === 11000) {
    //   return res
    //     .status(ERROR_CODES.CONFLICT)
    //     .send({ message: "User already exists." });
    // }

    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  }
};

module.exports.updateUserData = async (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .send({ message: "User not found." });
    }

    return res.status(ERROR_CODES.OK).json(updatedUser);
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

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  // if (email && password) {
  //   return res.status(ERROR_CODES.OK).send({ message: "Login successful." });
  // }

  if (!email || !password) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(ERROR_CODES.OK).send({ token });
  } catch (err) {
    return res
      .status(ERROR_CODES.AUTHENTICATION_ERROR)
      .send({ message: err.message });
  }
};

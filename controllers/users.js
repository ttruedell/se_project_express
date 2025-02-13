const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const validator = require("validator");

const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

// const ERROR_CODES = require("../utils/errors");

// const {
//   RequestSuccess,
//   ResourceCreated,
//   BadRequestError,
//   UnauthorizedError,
//   NotFoundError,
//   ConflictError,
// } = require("../utils/customErrors");

const BadRequestError = require("../utils/errors/BadRequestError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");

module.exports.getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    // return res
    //   .status(/*ERROR_CODES.BAD_REQUEST*/ BadRequestError)
    //   .send({ message: "Invalid user ID format." });
    return next(new BadRequestError("Invalid user ID format."));
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      // return res
      //   .status(ERROR_CODES.NOT_FOUND)
      //   .send({ message: "User not found." });
      return next(new NotFoundError("User not found."));
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
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

module.exports.createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    // return res
    //   .status(ERROR_CODES.BAD_REQUEST)
    //   .send({ message: "Invalid email provided." });
    return next(new BadRequestError("Invalid email provided."));
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // return res
      //   .status(ERROR_CODES.CONFLICT)
      //   .send({ message: "User already exists." });
      return next(new ConflictError("User already exists."));
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    return res.status(201).json({
      name: newUser.name,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (error) {
    // console.error(error);

    if (error.name === "ValidationError") {
      // return res
      //   .status(ERROR_CODES.BAD_REQUEST)
      //   .send({ message: "Invalid data provided." });
      return next(new BadRequestError("Invalid data provided."));
    }

    if (error.name === "MongoError" && error.code === 11000) {
      // return res
      //   .status(ERROR_CODES.CONFLICT)
      //   .send({ message: "User already exists." });
      return next(new ConflictError("User already exists."));
    }

    // return res
    //   .status(ERROR_CODES.SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server." });
    return next(error);
  }
};

module.exports.updateUserData = async (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      // return res
      //   .status(ERROR_CODES.NOT_FOUND)
      //   .send({ message: "User not found." });
      return next(new NotFoundError("User not found."));
    }

    return res.status(200).json(updatedUser);
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

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    // return res
    //   .status(ERROR_CODES.BAD_REQUEST)
    //   .send({ message: "Email and password are required." });
    return next(new BadRequestError("Email and password are required."));
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id },
      { JWT_SECRET },
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).send({ token });
  } catch (error) {
    if (error.message === "Incorrect email or password.") {
      // return res
      //   .status(ERROR_CODES.AUTHENTICATION_ERROR)
      //   .send({ message: "Incorrect email or password." });
      return next(new UnauthorizedError("Incorrect email or password."));
    }

    // return res
    //   .status(ERROR_CODES.SERVER_ERROR)
    //   .send({ message: "An error has occurred on the server." });
    return next(error);
  }
};

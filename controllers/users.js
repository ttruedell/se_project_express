const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const ERROR_CODES = require("../utils/errors");

// module.exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     return res.status(ERROR_CODES.OK).json(users);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(ERROR_CODES.SERVER_ERROR)
//       .send({ message: "Error fetching users." });
//   }
// };

// module.exports.getUser = async (req, res) => {
module.exports.getCurrentUser = async (req, res) => {
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

    return res.status(ERROR_CODES.OK).json(user);
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

  try {
    const hash = await bcrypt.hash(password, 10);

    // const newUser = new User({ name, avatar });
    const newUser = User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    // await newUser.save();
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

    if (error.name === "MongoError" && error.code === 11000) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .send({ message: "User already exists." });
    }

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

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(ERROR_CODES.AUTHENTICATION_ERROR)
        .send({ message: err.message });
    });
};

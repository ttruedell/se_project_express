const jwt = require("jsonwebtoken");

// const { AUTHENTICATION_ERROR } = require("../utils/errors");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  console.log("Authorization header:", authorization);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res
    //   .status(AUTHENTICATION_ERROR)
    //   .send({ message: "Authorization required" });
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  console.log("Token extracted:", token);

  let payload;

  try {
    payload = jwt.verify(token, { JWT_SECRET });
    console.log("Token payload:", payload);
  } catch (err) {
    console.error("Token verification failed:", err);
    // return res
    //   .status(AUTHENTICATION_ERROR)
    //   .send({ message: "Authorization required" });
    return next(new UnauthorizedError("Authorization required"));
  }

  req.user = payload;

  return next();
};

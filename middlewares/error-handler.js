// const ERROR_CODES = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const { statusCode = 500, message } = err;

  res.status(statusCode).json({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });

  // next();
};

module.exports = errorHandler;

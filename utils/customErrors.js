// const ERROR_CODES = require("./errors");

class RequestSuccess extends Error {
  constructor(message = "OK") {
    super(message);
    this.statusCode = 200;
  }
}

class ResourceCreated extends Error {
  constructor(message = "Created") {
    super(message);
    this.statusCode = 201;
  }
}

class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  RequestSuccess,
  ResourceCreated,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};

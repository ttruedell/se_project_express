class RequestSuccess extends Error {
  constructor(message = "OK") {
    super(message);
    this.statusCode = 200;
  }
}

module.exports = RequestSuccess;

class ResourceCreated extends Error {
  constructor(message = "Created") {
    super(message);
    this.statusCode = 201;
  }
}

module.exports = ResourceCreated;

const ApiError = require('./api-error');

class NamedApiError extends ApiError {

  constructor(name, message, data, statusCode) {
    super(message, data, statusCode);
    this.name = name;
  }
}

module.exports = NamedApiError;




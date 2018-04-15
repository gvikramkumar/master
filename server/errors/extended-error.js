const BasicError = require('./basic-error');

/**
 * ExtendedError
 * @desc - a json stringifyable class with statusCode derfault that includes a data payload for additional information
 */
class ExtendedError extends BasicError {

  constructor(message, data, errorCode, statusCode) {
    super(message, errorCode, statusCode);
    this.data = data;
  }

}

module.exports = ExtendedError;




/**
 * BasicError
 * @desc - a json stringifyable class with statusCode default
 */
class BasicError {

    constructor(message, errorCode, statusCode) {
        this.message = message;
        if (errorCode) {
          this.errorCode = errorCode;
        }
        this.statusCode = statusCode || 500;
    }

}

module.exports = BasicError;




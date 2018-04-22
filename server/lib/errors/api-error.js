
class ApiError {

  constructor(message, data = null, statusCode = 500) {
    this.message = message;
    if (data) {
      this.data = data;
    }
    this.statusCode = statusCode
  }
}

module.exports = ApiError;




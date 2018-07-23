export class ApiError extends Error {

  constructor(public message: string, public data = null, public statusCode = 500) {
    super(message);
  }
}





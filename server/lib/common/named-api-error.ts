import {ApiError} from './api-error';

export class NamedApiError extends ApiError {

  constructor(public name: string, message?: string, data?, statusCode?: number) {
    super(message, data, statusCode);
  }
}





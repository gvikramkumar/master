import { Request } from 'express';

export default interface ApiRequest extends Request {
  [key: string]: any;
}



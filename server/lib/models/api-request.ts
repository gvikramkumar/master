import { Request } from 'express';
import User from './user';

export default interface ApiRequest extends Request {
  [key: string]: any;
}



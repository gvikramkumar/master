import { Request } from 'express';
import User from './user';

export default interface IApiRequest extends Request {
  user: User;
}



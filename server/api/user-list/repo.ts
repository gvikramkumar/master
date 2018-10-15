import {injectable} from 'inversify';
import {Schema} from 'mongoose';
import RepoBase from '../../lib/base-classes/repo-base';


const schema = new Schema(
  {
    userId: {type: String, required: true},
    fullName: String,
    email: String,
    roles: {type: [String], required: true},
    updatedDate: {type: Date, required: true}
  },
  {collection: 'dfa_user'}
);

@injectable()
export default class UserListRepo extends RepoBase {
  constructor() {
    super(schema, 'UserList');
  }
}


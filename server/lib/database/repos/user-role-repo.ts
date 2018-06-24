import mg from 'mongoose';
import RepoBase from '../../base-classes/repo-base';
import {injectable} from 'inversify';


const schema = new mg.Schema(
  {
    userId: {type: String, required: true},
    role: {type: String, required: true}
  },
  {collection: 'user_role'}
);

@injectable()
export default class UserRoleRepo extends RepoBase {
  constructor() {
    super(schema, 'UserRole');
  }

  getRolesByUserId(userId) {
    return this.Model.find({userId}, {role: 1}).exec();
  }

  userHasRole(userId, role) {
    return Promise.resolve(true);
/*
    return this.Model.findOne({userId, role})
      .then(x => Boolean(x));
*/
  }

}


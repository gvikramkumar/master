import mg from 'mongoose';
import RepoBase from '../../base-classes/repo-base';


const schema = new mg.Schema(
  {
    userId: {type: String, required: true},
    role: {type: String, required: true}
  },
  {collection: 'user_role'}
);

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


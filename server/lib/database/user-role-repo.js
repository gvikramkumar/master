const mg = require('mongoose'),
  RepoBase = require('../models/repo-base');


const schema = new mg.Schema(
  {
    userId: {type: String, required: true},
    role: {type: String, required: true}
  },
  {collection: 'user_role'}
);

class UserRoleRepo extends RepoBase {
  constructor() {
    super(schema, 'UserRole');
  }

  getRolesByUserId(userId) {
    return this.Model.find({userId}, {role: 1}).exec();
  }

  userHasRole(userId, role) {
    return this.Model.findOne({userId, role})
      .then(x => Boolean(x));
  }

}

module.exports = new UserRoleRepo();

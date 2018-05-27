const _ = require('lodash');

module.exports = class User {

  constructor(id, name, email, roles) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.roles = roles;

    this.roles = [
      'api:access',
      'api:manage',
      'api:admin'
    ]
  }

  isAuthorized(_allowedRoles) {
        const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
        return _.intersection(allowedRoles, this.roles).length > 0;
  }

}

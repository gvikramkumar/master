import * as _ from 'lodash';

export default class User {

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public roles: string[]) {

    this.roles = [
      'api:access',
      'api:manage',
      'api:admin'
    ];
  }

  isAuthorized(_allowedRoles) {
        const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
        return _.intersection(allowedRoles, this.roles).length > 0;
  }

}

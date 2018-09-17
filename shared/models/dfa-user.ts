import * as _ from 'lodash';

export default class DfaUser {

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public roles: string[]) {
  }

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }

  isAuthorized(_allowedRoles) {
    const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
    allowedRoles.push('itadmin'); // has access to everything
    return _.intersection(allowedRoles, this.roles).length > 0;
  }

}




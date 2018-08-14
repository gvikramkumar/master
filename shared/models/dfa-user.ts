
import * as _ from 'lodash';

export default class DfaUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[] = [];

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    roles?: string[]) {

    this.roles = [
      'api:access',
      'api:manage',
      'api:admin',
      'dfa:access',
      'prof:access',
      'prof-bu:access',
      'prof-bu:upload',
      'prof-rm:access',
      'prof-rm:manage',
      'prof-sm:access',
      'prof-sm:manage'
    ];
  }

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }

  isAuthorized(_allowedRoles) {
    const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
    return _.intersection(allowedRoles, this.roles).length > 0;
  }

}




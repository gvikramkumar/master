import * as _ from 'lodash';

export class User {

  constructor(public id: string, public name: string, public roles: string[]) {

    this.roles = [
      'dfa:access',
      'prof:access',
      'prof-bu:access',
      'prof-bu:upload',
      'prof-rm:access',
      'prof-rm:manage',
      'prof-sm:access',
      'prof-sm:manage'
    ]
  }

  isAuthorized(_allowedRoles: string) {
    const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
    return _.intersection(allowedRoles, this.roles).length > 0;
  }

}

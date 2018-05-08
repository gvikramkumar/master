import * as _ from 'lodash';

export class User {

  constructor(public id: string, public name: string, public roles: string[]) {

    this.roles = [
      'dfa:access',
      'pft:access',
      'pft-bu:access',
      'pft-bu:upload',
      'pft-rm:access',
      'pft-rm:manage',
      'pft-sm:access',
      'pft-sm:manage'
    ]
  }

  isAuthorized(_allowedRoles: string) {
    const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
    return _.intersection(allowedRoles, this.roles).length > 0;
  }

}

import * as _ from 'lodash';

export class User {

  constructor(public id: string, public name: string, public roles: string[]) {

    this.roles = [
      'pft:bu_upload',
      'pft:bu_access',
    ]
  }

  isAuthorized(_allowedRoles: string) {
    return true; //todo: auth fix
/*
    // we'll use lower case for all roles to avoid case issues: pft-bu:upload_file
    // module-section:snake_case_role
    const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
    return _.intersection(allowedRoles, this.roles).length > 0;
*/
  }

}

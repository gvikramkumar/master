

module.exports = class User {

  constructor(id, name, roles) {
    this.id = id;
    this.name = name;
    this.roles = roles;
  }

  isAuthorized(_allowedRoles) {
    return true; //todo: auth fix
    /*
        // we'll use lower case for all roles to avoid case issues: pft-bu:upload_file
        // module-section:snake_case_role
        const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
        return _.intersection(allowedRoles, this.roles).length > 0;
    */
  }

}

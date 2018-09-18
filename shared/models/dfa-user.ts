import * as _ from 'lodash';
import AnyObj from './any-obj';
import {DfaModuleAbbrev} from '../enums';

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

  isModuleUserOnly(moduleAbbrev) {
    switch (moduleAbbrev) {
      case DfaModuleAbbrev.prof:
        return _.includes(this.roles, 'prof:user') && !_.includes(this.roles, 'prof:admin') &&
          !_.includes(this.roles, 'itadmin');
      default:
        return false;
    }
  }

  isModuleUser(moduleAbbrev) {
    switch (moduleAbbrev) {
      case DfaModuleAbbrev.prof:
        return _.includes(this.roles, 'prof:user');
      default:
        return false;
    }
  }

  isModuleAdmin(moduleAbbrev) {
    switch (moduleAbbrev) {
      case DfaModuleAbbrev.prof:
        return _.includes(this.roles, 'prof:admin');
      default:
        return false;
    }
  }

  isAuthorized(_allowedRoles) {
    if (!_allowedRoles || _allowedRoles.trim().length === 0) {
      throw new Error('getAllowedRoles: no roles sent in.');
    }

    const allowedRoles = _allowedRoles.split(',').map(s => s.toLowerCase().trim());
    allowedRoles.filter(x => !!x); // remove empty strings
    allowedRoles.push('itadmin'); // has access to everything
    return _.intersection(allowedRoles, this.roles).length > 0;
  }

  // pass in an array of objects and specify the property with authorization role,
  // will return a filtered list of objects that are authorized
  authorizeObjects<T>(objs: T[], prop) {
    return <T[]>objs.filter(obj => this.isAuthorized(obj[prop]));
  }

}




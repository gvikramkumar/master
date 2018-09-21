import * as _ from 'lodash';
import AnyObj from './any-obj';
import {DfaModuleAbbrev, DfaModuleIds} from '../enums';

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

  isModuleUserOnly(moduleId) {
    switch (moduleId) {
      case DfaModuleIds.prof:
        return _.includes(this.roles, 'prof:user') && !_.includes(this.roles, 'prof:admin') &&
          !_.includes(this.roles, 'itadmin');
    }
    return false;
  }

  isModuleUser(moduleId) {
    switch (moduleId) {
      case DfaModuleIds.prof:
        return _.includes(this.roles, 'prof:user');
    }
    return false;
  }

  isModuleAdmin(moduleId) {
    switch (moduleId) {
      case DfaModuleIds.prof:
        return _.includes(this.roles, 'prof:admin');
    }
    return false;
  }

  isItAdmin() {
    return _.includes(this.roles, 'itadmin');
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

  hasUserId(_allowedUserIds) {
    if (!_allowedUserIds || _allowedUserIds.trim().length === 0) {
      throw new Error('getAllowedRoles: no roles sent in.');
    }

    const allowedUserIds = _allowedUserIds.split(',').map(s => s.toLowerCase().trim());
    allowedUserIds.filter(x => !!x); // remove empty strings
    return _.includes(allowedUserIds, this.id);
  }

  // pass in an array of objects and specify the property with authorization role,
  // will return a filtered list of objects that are authorized
  authorizeObjects<T>(objs: T[], prop) {
    return <T[]>objs.filter(obj => this.isAuthorized(obj[prop]));
  }

}




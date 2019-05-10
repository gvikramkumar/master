import _ from 'lodash';
import {difference, flatten, includes, intersection} from 'lodash';
import AnyObj from './any-obj';
import {DfaModule} from '../../ui/src/app/modules/_common/models/module';
import {shUtil} from '../misc/shared-util';

export default class DfaUser {
  moduleId?: number;
  store?: AnyObj;
  genericRoles = ['itadmin', 'biz-admin', 'super-user', 'biz-user', 'end-user'];

  // have to pass in either moduleId (api) or store (ui). This value can change in ui but is same for each request in api
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public roles: string[],
    public genericUsers,
    public modules: DfaModule[]) {
  }

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }

  isGenericUser() {
    return _.includes(this.genericUsers, this.id);
  }

  // todo: make all these type checks for art roles
  isAdminRoleType(role: string) {
    return role.toLowerCase().indexOf('admin') !== -1;
  }

  isSuperUserRoleType(role) {
    return role.toLowerCase().indexOf('super user') !== -1;
  }

  isBusinessUserRoleType(role) {
    return role.toLowerCase().indexOf('business user') !== -1;
  }

  isEndUserRoleType(role) {
    return role.toLowerCase().indexOf('end user') !== -1;
  }

  isUserRoleType(role: string) {
    return this.isSuperUserRoleType(role) || this.isBusinessUserRoleType(role) || this.isEndUserRoleType(role);
  }

  // for protecting api admin endpoints
  hasAdminRole() {
    let adminRoles = this.modules.map(x => shUtil.stringToArray(x.roles).filter(this.isAdminRoleType.bind(this)));
    adminRoles = flatten(adminRoles).concat('it administrator').map(x => x.toLowerCase());
    return intersection(adminRoles, this.roles).length > 0;
  }

  // for protecting api non-admin endpoints, this is our minimum access to hit api
  hasAdminOrUserRole() {
    const userRoles = flatten(this.modules.map(x => shUtil.stringToArray(x.roles).filter(this.isUserRoleType.bind(this))));
    return intersection(userRoles, this.roles).length > 0 || this.hasAdminRole();
  }

  isItAdmin() {
    return _.includes(this.roles, 'it administrator');
  }

  isModuleAdmin() {
    return _.includes(this.roles, this.getModuleAdminRole()) && !this.isItAdmin();
  }

  isModuleAdminOrGreater() {
    return this.isModuleAdmin() || this.isItAdmin();
  }

  isModuleSuperUser() {
    return _.includes(this.roles, this.getModuleSuperUserRole()) && !this.isModuleAdminOrGreater();
  }

  isModuleSuperUserOrGreater() {
    return this.isModuleSuperUser() || this.isModuleAdminOrGreater();
  }

  isModuleBusinessUser() {
    return _.includes(this.roles, this.getModuleBusinessUserRole()) && !this.isModuleSuperUserOrGreater();
  }


  isModuleBusinessUserOrGreater() {
    return this.isModuleBusinessUser() || this.isModuleSuperUserOrGreater();
  }

  isModuleEndUser() {
    return _.includes(this.roles, this.getModuleEndUserRole()) && !this.isModuleBusinessUserOrGreater();
  }

  isModuleEndUserOrGreater() {
    return this.isModuleEndUser() || this.isModuleBusinessUserOrGreater();
  }

  // Only allow the given roles, not roles above. This is for singling out lower roles, say finAuthDisabled
  // or showing an icon for end-user when roles above see something different.
  isAuthorizedOnly(_allowedRoles: string) {
    if (!_allowedRoles || _allowedRoles.trim().length === 0) {
      throw new Error('isAuthorizedOnly: no roles sent in.');
    }
    let allowedRoles = shUtil.stringToArray(_allowedRoles);
    this.verifyAllRolesAreGenericOrActualRoles(allowedRoles);
    allowedRoles = this.getRolesFromGenericRoles(allowedRoles);
    return intersection(this.roles, allowedRoles).length > 0;
  }

  // for generic roles, only need minimum role required as it will add roles above so if
  // finAuth="super-user" then applies to biz-admin and itadmin users as well.
  isAuthorized(_allowedRoles: string) {
    if (!_allowedRoles || _allowedRoles.trim().length === 0) {
      throw new Error('isAuthorized: no roles sent in.');
    }
    let allowedRoles = shUtil.stringToArray(_allowedRoles);
    this.verifyAllRolesAreGenericOrActualRoles(allowedRoles);
    allowedRoles = this.getRolesFromGenericRolesAndAbove(allowedRoles);
    return intersection(this.roles, allowedRoles.concat(['it administrator'])).length > 0;
  }

  verifyAllRolesAreGenericRoles(roles) {
    if (!(roles.difference(roles, this.genericRoles).length === 0)) {
      throw new Error(`Some roles don't exist: ${roles.join(',')}`);
    }
  }

  verifyAllRolesAreGenericOrActualRoles(roles) {
    if (!(difference(roles, this.genericRoles.concat(['it administrator']).concat(flatten(this.modules.map(m => shUtil.stringToArray(m.roles))))).length === 0)) {
      throw new Error(`Some roles don't exist: ${roles.join(',')}`);
    }
  }

  // replace generic roles with same module roles, keep actual roles
  getRolesFromGenericRoles(roles) {
    // if actual roles, just return them
    if (roles.filter(x => includes(this.genericRoles, x)).length === 0) {
      return roles;
    }
    // not actual roles, so must all be generic, we don't allow a mix
    if (roles.filter(x => !includes(this.genericRoles, x)).length > 0) {
      throw new Error(`getRolesFromGenericRoles: all roles must be generic or actual.`);
    }
    const rtn = [];
    if (shUtil.isAdminModuleId(this.getModuleId())) {
      return [];
    }
    roles.forEach(role => {
      switch (role) {
        case 'itadmin':
          rtn.push(this.getItadminRole());
          break;
        case 'biz-admin':
          rtn.push(this.getModuleAdminRole());
          break;
        case 'super-user':
          rtn.push(this.getModuleSuperUserRole());
          break;
        case 'biz-user':
          rtn.push(this.getModuleBusinessUserRole());
          break;
        case 'end-user':
          rtn.push(this.getModuleEndUserRole());
          break;
        default:
          throw new Error(`getRolesFromGenericRoles: unknown role type: ${role}`);
      }
    });
    return rtn;
  }

  // replace generic roles with same module roles AND ABOVE, this affords you to use minimum role required in
  // finAuth or user.usAuthorized
  getRolesFromGenericRolesAndAbove(roles) {
    // if actual roles, just return them
    if (roles.filter(x => includes(this.genericRoles, x)).length === 0) {
      return roles;
    }
    // not actual roles, so must all be generic, we don't allow a mix
    if (roles.filter(x => !includes(this.genericRoles, x)).length > 0) {
      throw new Error(`getRolesFromGenericRoles: all roles must be generic or actual.`);
    }
    const rtn = [];
    if (shUtil.isAdminModuleId(this.getModuleId())) {
      return [];
    }
    roles.forEach(role => {
      switch (role) {
        case 'itadmin':
          rtn.push(this.getItadminRole());
          break;
        case 'biz-admin':
          rtn.push(this.getModuleAdminRole());
          break;
        case 'super-user':
          rtn.push(this.getModuleAdminRole());
          rtn.push(this.getModuleSuperUserRole());
          break;
        case 'biz-user':
          rtn.push(this.getModuleAdminRole());
          rtn.push(this.getModuleSuperUserRole());
          rtn.push(this.getModuleBusinessUserRole());
          break;
        case 'end-user':
          rtn.push(this.getModuleAdminRole());
          rtn.push(this.getModuleSuperUserRole());
          rtn.push(this.getModuleBusinessUserRole());
          rtn.push(this.getModuleEndUserRole());
          break;
        default:
          throw new Error(`getRolesFromGenericRoles: unknown role type: ${role}`);
      }
    });
    return rtn;
  }

  getItadminRole() {
    return 'it administrator';
  }

  getModuleAdminRole() {
    const roles = this.getModuleRoles().filter(this.isAdminRoleType.bind(this));
    if (roles.length !== 1) {
      throw new Error(`getModuleAdminRole: no admin role for moduleId: ${this.getModuleId()}`);
    }
    return roles[0];
  }

  getModuleSuperUserRole() {
    const roles = this.getModuleRoles().filter(this.isSuperUserRoleType.bind(this));
    if (roles.length !== 1) {
      throw new Error(`getModuleSuperUserRole: no super user role for moduleId: ${this.getModuleId()}`);
    }
    return roles[0];
  }

  getModuleBusinessUserRole() {
    const roles = this.getModuleRoles().filter(this.isBusinessUserRoleType.bind(this));
    if (roles.length !== 1) {
      throw new Error(`getModuleEndUserRole: no business user role for moduleId: ${this.getModuleId()}`);
    }
    return roles[0];
  }

  getModuleEndUserRole() {
    const roles = this.getModuleRoles().filter(this.isEndUserRoleType.bind(this));
    if (roles.length !== 1) {
      throw new Error(`getModuleEndUserRole: no end user role for moduleId: ${this.getModuleId()}`);
    }
    return roles[0];
  }

  getModuleRoles(): string[] {
    const moduleId = this.getModuleId();
    const module = _.find<DfaModule>(this.modules, {moduleId});
    if (!module || !module.roles.length) {
      throw new Error(`getModuleRoles: no roles for moduleId: ${moduleId}`);
    }
    return shUtil.stringToArray(module.roles);
  }

  // we use this from the api which needs to set DfaUser.moduleId before calling any functions that require it.
  // we use it from the ui which needs to set DfaUser.store before calling any functions that use it.
  getModuleId(_moduleId?) {
    const moduleId = _moduleId || _.get(this.store, 'module.moduleId');
    if (!moduleId) {
      throw new Error('getModuleId: no moduleId or store.module.moduleId');
    }
    return moduleId;
  }

  hasUserId(_allowedUserIds) {
    if (!_allowedUserIds || _allowedUserIds.trim().length === 0) {
      throw new Error('hasUserId: no roles sent in.');
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




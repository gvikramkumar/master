import DfaUser from '../../../shared/models/dfa-user';
import * as _ from 'lodash';
import LookupRepo from '../../api/common/lookup/repo';
import {ModuleRepo} from '../../api/common/module/repo';
import {shUtil} from '../../../shared/shared-util';
import {ApiError} from '../common/api-error';
import {svrUtil} from '../common/svr-util';
import config from '../../config/get-config';
import {finRequest} from '../common/fin-request';
import UserListRepo from '../../api/user-list/repo';
import {UserList} from '../../../shared/models/user-list';
import {FinDfaCookie} from '../../api/cookie/fin-dfa.cookie';

export function addSsoUser() {

  /*
    const roles = [
      'it administrator',
      'profitability allocations:business admin',
      'profitability allocations:super user',
      'profitability allocations:end user',
    ];
  */

  return function (req, res, next) {
    const headers = req.headers;
    const lookupRepo = new LookupRepo();
    const moduleRepo = new ModuleRepo();
    const userListRepo = new UserListRepo();
    const isLocalEnv = svrUtil.isLocalEnv();
    let localRoles, modules, genericUsers, updateUserList;
    const findfa = new FinDfaCookie(req, res);

    Promise.all([
      lookupRepo.getValues(['localenv-roles', 'generic-users']),
      moduleRepo.getActiveSortedByDisplayOrder()
    ])
      .then(results => {
        localRoles = results[0][0] ? results[0][0] : ['it administrator'];
        genericUsers = results[0][1];
        modules = results[1]

        if (false) { // isLocalEnv) {
          return new DfaUser(
            'jodoe',
            'John',
            'Doe',
            'dakahle@cisco.com',
            localRoles,
            genericUsers,
            modules
          );
        } else {
          headers['auth-user'] = 'dakahle';
          headers['givenname'] = 'Dan';
          headers['familyname'] = 'Kahle';
          headers['email'] = 'dakahle@cisco.com';

          const userId = headers['auth-user'];
          return Promise.resolve()
            .then(() => {
              const cookie = findfa.cookie;
              // we'll cache the users in database and if less than one minute old, we'll get the roles from there
              if (cookie && Date.now() - new Date(cookie.rolesUpdatedDate).getTime() > config.art.timeout) {
                console.log(`cookie timed out ${req.url} - ${req.method}`);
              }
              if (cookie && Date.now() - new Date(cookie.rolesUpdatedDate).getTime() <= config.art.timeout) {
                console.log(`using cookie ${req.url} - ${req.method}`);
                return cookie.roles;
              } else {
                console.log(`using art ${req.url} - ${req.method}`);
                updateUserList = true;
                return getArtRoles(userId);
              }
            })
            .then(roles => {
              return new DfaUser(
                userId,
                headers['givenname'],
                headers['familyname'],
                headers['email'],
                roles,
                genericUsers,
                modules
              );
            });
        }
      })
      .then(user => {
        if (!(isLocalEnv || user.hasAdminOrUserRole() || user.isGenericUser())) {
          res.status(401).send(shUtil.getHtmlForLargeSingleMessage(`User access required.`));
        } else {
          req.user = user;
          req.dfaData = {modules};
          // this is the ui's init call to get user, with each ui app load, we'll store the user's details in database
          if (updateUserList) {
            findfa.updateCookie({roles: user.roles, rolesUpdatedDate: new Date()});
            const userList = new UserList(user.id, user.fullName, user.email, user.roles, new Date());
            return userListRepo.upsertQueryOne({userId: user.id}, userList, user.id, false, true)
              .then(() => next());
          } else {
            next();
          }
        }
      })
      .catch(next);
  };

}

function getArtRoles(userId) {
  const artUser = process.env.ART_USER;
  const artPassword = process.env.ART_PASSWORD;
  if (!artUser || !artPassword) {
    throw new ApiError('No ART_USER or ART_PASSWORD');
  }
  const options = {
    url: config.art.url,
    method: 'post',
    auth: {
      user: artUser,
      pass: artPassword,
      sendImmediately: false
    },
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      methodType: 'SUBJECT_RESOURCE_MAP_ROLEBUNDLES_CONTEXT',
      methodName: 'getPermissibleResourcesForUser',
      subject: userId,
      resourceFQN: 'Finance:Financial Performance Planning and Analysis:Digitized Financial Allocations (DFA)',
      context: 'Global Context:Global Context',
      roleBundles: { 'roleBundle': ['Default'] }
    }
  };
  return finRequest(options)
    .then(result => _.get(result, 'body.resources.resourceFQN') || [])
    .then(roles => roles.map(x => x.toLowerCase()));
}

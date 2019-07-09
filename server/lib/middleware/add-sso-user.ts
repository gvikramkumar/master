import DfaUser from '../../../shared/models/dfa-user';
import _ from 'lodash';
import LookupRepo from '../../api/lookup/repo';
import {ModuleRepo} from '../../api/common/module/repo';
import {shUtil} from '../../../shared/misc/shared-util';
import {ApiError} from '../common/api-error';
import {svrUtil} from '../common/svr-util';
import config from '../../config/get-config';
import {finRequest} from '../common/fin-request';
import UserListRepo from '../../api/user-list/repo';
import {UserList} from '../../../shared/models/user-list';
import {NamedApiError} from '../common/named-api-error';
import {DisregardError} from '../common/disregard-error';

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
    // const isLocalEnv = false;
    let localRoles, modules, genericUsers, updateUserList;

    Promise.all([
      lookupRepo.getValues(['localenv-roles', 'generic-users']),
      moduleRepo.getActiveSortedByDisplayOrder()
    ])
      .then(results => {
        localRoles = results[0][0] ? results[0][0] : ['it administrator'];
        genericUsers = results[0][1];
        modules = results[1]

        if (isLocalEnv) {
          if (!genericUsers) {
            throw new ApiError('Localenv has no genericUsers. Need to run database updates.');
          }
          genericUsers.push('jodoe');
          return new DfaUser(
            'jodoe',
            'John',
            'Doe',
            'jodoe@cisco.com',
            localRoles,
            genericUsers,
            modules
          );
        } else {
/*
          headers['auth-user'] = 'dakahle';
          headers['givenname'] = 'Dan';
          headers['familyname'] = 'Kahle';
          headers['email'] = 'dakahle@cisco.com';
*/
          const userId = headers['auth-user'];
          if (!userId) {
            const msg = `No user ID`;
            console.error(msg);
            res.status(401).send(shUtil.getHtmlForLargeSingleMessage(msg));
            return Promise.reject(new DisregardError());
          }
          return userListRepo.getOneLatest({userId})
            .then(userList => {
              // we check ART on app init otherwise use cache. If no roles from art, use cache if there
              if (userList &&  !req.query.uiInitialization) { // && Date.now() - userList.updatedDate.getTime() <= config.art.timeout) {
                return userList.roles;
              } else {
                return getArtRoles(userId)
                  .then(roles => {
                    if (roles && roles.length) {
                      updateUserList = true;
                      return roles;
                    } else {
                      if (userList) {
                        return userList.roles;
                      } else {
                        return [];
                      }
                    }
                  });
              }
            })
            .then(roles => {
              if (userId !== 'dfaadmin.gen' && !roles.length) {
                const msg = `No user roles set up for user: ${userId}`;
                console.error(msg);
                res.status(401).send(shUtil.getHtmlForLargeSingleMessage(msg));
                return Promise.reject(new DisregardError());
              }
              return roles;
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
          const msg = `User access required for user: ${req.headers['auth-user']}`;
          console.error(msg);
          res.status(401).send(shUtil.getHtmlForLargeSingleMessage(msg));
          return Promise.reject(new DisregardError());
        } else {
          req.user = user;
          req.dfa = {modules};
          // this is the ui's init call to get user, with each ui app load, we'll store the user's details in database
          if (updateUserList) {
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

export function getArtRoles(userId) {
  const artUser = process.env.ART_USER;
  const artPassword = process.env.ART_PASSWORD;
  if (!artUser || !artPassword) {
    throw new ApiError('No ART_USER or ART_PASSWORD.');
  }
  const options = {
    url: config.art.url,
    method: 'POST',
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
    .then(roles => roles.map(x => x.toLowerCase()))
    .catch(err => {
      console.error('ART request failure', err);
      return []; // failover to database when ART is down
    });

}

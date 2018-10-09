import DfaUser from '../../../shared/models/dfa-user';
import * as _ from 'lodash';
import LookupRepo from '../../api/common/lookup/repo';
import {ModuleRepo} from '../../api/common/module/repo';
import {shUtil} from '../../../shared/shared-util';
import {ApiError} from '../common/api-error';
import {svrUtil} from '../common/svr-util';

export function addSsoUser() {

  /*
    const roles = [
      'itadmin',
      'prof:measure',
      'prof:admin',
      'prof:super-user',
      'prof:end-user',
    ];
  */

  return function (req, res, next) {
    const headers = req.headers;
    const lookupRepo = new LookupRepo();
    const moduleRepo = new ModuleRepo();
    const localEnv = svrUtil.isLocalEnv();
    let roles, modules;
    const userId = localEnv ? 'jodoe' : req.headers['auth-user'];

    Promise.all([
      lookupRepo.getValue(userId),
      moduleRepo.getManyActive()
    ])
      .then(results => {
        roles = results[0] ? results[0] : ['itadmin'];
        modules = results[1];

        const roleList = modules.filter(m => !m.roles || !m.roles.trim());
        if (roleList.length > 0) {
          throw new ApiError(`The following modules don't have roles: ${roleList.map(r => r.name).join(', ')}`);
        }

        if (localEnv) {
          return new DfaUser(
            'jodoe',
            'John',
            'Doe',
            'moltman@cisco.com',
            roles,
            modules
          );
        } else {
          return Promise.resolve() // get roles from onramp table here
            .then(usersRoles => {
              return new DfaUser(
                headers['auth-user'],
                headers['givenname'],
                headers['familyname'],
                headers['email'],
                roles,
                modules
              );
            });
        }
      })
      .then(user => {
        if (!user.hasAdminOrUserRole()) {
          res.status(401).send(shUtil.getHtmlForLargeSingleMessage(`User access required.`));
        } else {
          req.user = user;
          req.dfaData = {modules};
          console.log('addssouser', req.url, req.user && req.user.id, req.body && req.body.moduleId);
          next();
        }
      })
      .catch(next);
  };

}


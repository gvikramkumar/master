import DfaUser from '../../../shared/models/dfa-user';
import * as _ from 'lodash';

export function addSsoUser() {

  const roles = [
    'itadmin',
    'prof:measure',
    'prof:admin',
    'prof:user',
  ];

  return function(req, res, next) {
    const headers = req.headers;
    let promise;

    if (!process.env.NODE_ENV || _.includes(['dev', 'ldev', 'unit'], process.env.NODE_ENV)) {
      promise = Promise.resolve(new DfaUser(
        'jodoe',
        'John',
        'Doe',
        'dakahle@cisco.com',
        ['itadmin']
      ));
    } else {
      // todo: need to hit pg here and get users roles to pass into constructor
      promise = Promise.resolve('getroleshere')
        .then(usersRoles => {
          return new DfaUser(
            headers['auth-user'],
            headers['givenname'],
            headers['familyname'],
            headers['email'],
            ['itadmin']
          );
        });
    }

    promise.then(user => {
      req.user = user;
      next();
    });
  };

}


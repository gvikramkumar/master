import DfaUser from '../../../shared/models/dfa-user';

export function addSsoUser() {

  const roles = [
    'api:access',
    'api:manage',
    'api:admin',
    'dfa:access',
    'prof:access',
    'prof-bu:access',
    'prof-bu:upload',
    'prof-rm:access',
    'prof-rm:manage',
    'prof-sm:access',
    'prof-sm:manage',
    'someMeasureRole'
  ].map(role => role.toLowerCase());

  return function(req, res, next) {
    const headers = req.headers;
    let promise;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'unit') {
      promise = Promise.resolve(new DfaUser(
        'jodoe',
        'John',
        'Doe',
        'moltman@cisco.com',
        roles
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
            roles // pass in usersRoles here, when you finally get them
          );
        });
    }

    promise.then(user => {
      req.user = user;
      next();
    });
  };

}


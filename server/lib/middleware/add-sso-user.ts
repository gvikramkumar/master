import DfaUser from '../../../shared/models/dfa-user';

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

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'unit') {
      promise = Promise.resolve(new DfaUser(
        'jodoe',
        'John',
        'Doe',
        'dakahle@cisco.com',
        ['prof:user']
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


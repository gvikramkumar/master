import DfaUser from '../../../shared/models/dfa-user';

export function addSsoUser() {

  return function(req, res, next) {
    const headers = req.headers;
    let user: DfaUser;

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'unit') {
      user = new DfaUser(
        'jodoe',
        'John',
        'Doe',
        'dakahle@cisco.com'
      );
    } else {
      user = new DfaUser(
        headers['auth-user'],
        headers['givenname'],
        headers['familyname'],
        headers['email']
      );
    }

    req.user = user;
    next();
  };

}


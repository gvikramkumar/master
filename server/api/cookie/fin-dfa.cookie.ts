import {CookieBase} from '../../lib/base-classes/cookie-base';


export class FinDfaCookie extends CookieBase {
  roles: string[];
  rolesUpdatedDate: Date;

  constructor(req, res) {
    super(req, res, 'fin-dfa', 'roles, rolesUpdatedDate');
  }

}


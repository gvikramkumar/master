import {CookieBase} from '../../lib/base-classes/cookie-base';


export class FinDfaCookie extends CookieBase {
  name = 'fin-dfa';
  rolesUpdatedDate: Date;
  secureProps = 'rolesUpdatedDate';

  create() {
    this.rolesUpdatedDate = new Date();
  }

}


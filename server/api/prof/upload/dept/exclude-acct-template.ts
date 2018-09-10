import {svrUtil} from '../../../../lib/common/svr-util';

export default class DeptUploadExludeAcctTemplate {
  submeasureName: string;
  glAccount: string;

  constructor(row) {
    this.submeasureName = row[0];
    this.glAccount = row[1].toString();

    svrUtil.trimStringProperties(this);
  }

}

import util from '../../../../lib/common/util';

export default class DeptUploadExludeAcctTemplate {
  submeasureName: string;
  glAccount: number;

  constructor(row) {
    this.submeasureName = row[0];
    this.glAccount = Number(row[1]);

    util.trimStringProperties(this);
  }

}

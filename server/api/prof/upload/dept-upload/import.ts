import util from '../../../../lib/common/util';

export default class DeptUploadImport {
  submeasureName: string;
  departmentCode: number;
  glAccount: string;

  constructor(submeasureName, departmentCode, glAccount?) {
    this.submeasureName = submeasureName;
    this.departmentCode = departmentCode;
    this.glAccount = glAccount;

    util.trimStringProperties(this);
  }

}

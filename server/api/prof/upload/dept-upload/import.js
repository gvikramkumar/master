const util = require('../../../../lib/common/util');

module.exports = class DeptUploadImport {

  constructor(submeasureName, departmentCode, glAccount, startAccountCode, endAccountCode) {
    this.submeasureName = submeasureName;
    this.departmentCode = departmentCode;
    this.glAccount = glAccount;
    this.startAccountCode = startAccountCode;
    this.endAccountCode = endAccountCode;
    util.trimStringProperties(this);
  }

}

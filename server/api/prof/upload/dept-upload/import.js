const util = require('../../../../lib/common/util');

module.exports = class DeptUploadImport {

  constructor(submeasureName, departmentCode, glAccount) {
    this.submeasureName = submeasureName;
    this.departmentCode = departmentCode;
    if (glAccount) {
      this.glAccount = glAccount;
    }

    util.trimStringProperties(this);
  }

}

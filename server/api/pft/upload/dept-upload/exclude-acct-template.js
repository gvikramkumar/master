const util = require('../../../../lib/common/util');

module.exports = class DeptUploadExludeAcctTemplate {

  constructor(row) {
    this.submeasureName = row[0];
    this.glAccount = row[1];

    util.trimStringProperties(this);
  }

}

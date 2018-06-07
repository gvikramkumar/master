const util = require('../../../../lib/common/util');

module.exports = class DeptUploadDeptTemplate {

  constructor(row) {
    this.submeasureName = row[0];
    this.nodeValue = row[1];

    util.trimStringProperties(this);
  }

}

const util = require('../../../../lib/common/util');

module.exports = class DeptUploadImport {

  constructor(row, params) {
    this.submeasureName = row[0];
    this.hierarchyName = params.hierarchyName;
    this.nodeLevelValue = params.nodeLevelName;
    this.nodeId = params.nodeId;
    this.glAccount = row[1];

    util.trimStringProperties(this);
  }

}

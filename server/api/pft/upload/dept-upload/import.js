

module.exports = class DeptUploadImport {

  constructor(row, params) {
    this.submeasureName = row[0];
    this.hierarchyName = params.hierarchyName;
    this.nodeLevelValue = params.nodeLevelName;
    this.nodeId = params.nodeId;
    this.glAccount = row[1];

    this.trimStrings();
  }

  trimStrings() {
    Object.keys(this).forEach(key => {
      if (typeof this[key] === 'string') {
        this[key] = this[key].trim();
      }
    })
  }

}


module.exports = class DeptUploadExludeAcctTemplate {
  constructor(row) {
    this.submeasureName = row[0];
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

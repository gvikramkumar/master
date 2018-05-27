

module.exports = class MappingUploadImport {

  constructor(row) {
    this.submeasureName = row[0];
    this.product = row[1];
    this.sales = row[2];
    this.legalEntity = row[3];
    this.intBusinessEntity = row[4];
    this.scms = row[5];
    this.percentage = row[6];

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

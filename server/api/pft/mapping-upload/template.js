
module.exports = class MappingUploadTemplate {
  constructor(row) {
    this.submeasureName = row[0];
    this.inputProductValue = row[1];
    this.inputSalesValue = row[2];
    this.inputLegalEntityValue = row[3];
    this.inputBusinessEntityValue = row[4];
    this.scmsSegment = row[5];
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

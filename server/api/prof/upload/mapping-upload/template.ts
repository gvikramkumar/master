const util = require('../../../../lib/common/util');

export default class MappingUploadTemplate {
  submeasureName: string;
  inputProductValue: string;
  inputSalesValue: string;
  inputLegalEntityValue: string;
  inputBusinessEntityValue: string;
  scmsSegment: string;
  percentage: number;

  constructor(row) {
    this.submeasureName = row[0];
    this.inputProductValue = row[1];
    this.inputSalesValue = row[2];
    this.inputLegalEntityValue = row[3];
    this.inputBusinessEntityValue = row[4];
    this.scmsSegment = row[5];
    this.percentage = row[6];

    util.trimStringProperties(this);
  }

}

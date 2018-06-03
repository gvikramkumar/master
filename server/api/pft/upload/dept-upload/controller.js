const DeptUploadRepo = require('../../dollar-upload/repo'),
  DeptUploadTemplate = require('./dept-template'),
  DeptUploadImport = require('./import'),

const repo = new DeptUploadRepo();

module.exports = class DeptUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Department Upload';

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      nodeValue: 'Input Product Value',
      glAccount: 'GL Account'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ])
  }

  validate(row) {
    this.temp = new DeptUploadTemplate(row);
  }

  getImportDoc(row) {
    const doc = new DeptUploadImport(row);
    doc.fiscalMonth = this.fiscalMonth;
    return doc;
  }

}


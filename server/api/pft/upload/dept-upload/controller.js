const DeptUploadRepo = require('../../dollar-upload/repo'),
  DeptUploadDeptTemplate = require('./dept-template'),
  DeptUploadExludeAcctTemplate = require('./exclude-acct-template'),
  DeptUploadImport = require('./import');

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

  validateSheet1(row) {
    this.temp = new DeptUploadDeptTemplate(row);
  }

  validateSheet2(row) {
    this.temp = new DeptUploadExludeAcctTemplate(row);
  }

  importRows() {
    this.imports = this.rows.map(row => {
      const doc = new DeptUploadImport(row);
      doc.fiscalMonth = this.fiscalMonth;
      return doc;
    });
    return super.importRows();
  }
}


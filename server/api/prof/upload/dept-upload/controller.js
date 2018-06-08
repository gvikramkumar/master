const DeptUploadRepo = require('../../dept-upload/repo'),
  DeptUploadDeptTemplate = require('./dept-template'),
  DeptUploadExludeAcctTemplate = require('./exclude-acct-template'),
  DeptUploadImport = require('./import'),
  UploadController = require('../../../../lib/base-classes/upload-controller');

const repo = new DeptUploadRepo();

module.exports = class DeptUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Department Upload';
    this.rowColumnCount = 2;
    this.numSheets = 2;

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

  validateRow1(row) {
    this.temp = new DeptUploadDeptTemplate(row);
    return Promise.resolve();
  }

  validateRow2(row) {
    this.temp = new DeptUploadExludeAcctTemplate(row);
    return Promise.resolve();
  }

  validate() {
    return Promise.resolve();
  }


  getImportArray() {
    const imports = this.rows1.map(row => new DeptUploadImport(row, this.fiscalMonth));
    return Promise.resolve(imports);
  }
}


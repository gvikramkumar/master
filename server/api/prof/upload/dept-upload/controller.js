const DeptUploadRepo = require('../../dept-upload/repo'),
  DeptUploadDeptTemplate = require('./dept-template'),
  DeptUploadExludeAcctTemplate = require('./exclude-acct-template'),
  DeptUploadImport = require('./import'),
  UploadController = require('../../../../lib/base-classes/upload-controller'),
  SubmeasureRepo = require('../../../../api/common/submeasure/repo'),
  UserRoleRepo = require('../../../../lib/database/repos/user-role-repo'),
  _ = require('lodash');


const repo = new DeptUploadRepo();
const submeasureRepo = new SubmeasureRepo();
const userRoleRepo = new UserRoleRepo();

module.exports = class DeptUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Department Upload';
    this.hasTwoSheets = true;
    this.sheet1SubmeasureNames = [];
    this.startedSheet2 = false;

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      nodeValue: 'Node Value',
      glAccount: 'GL Account'
    }
  }

  getValidationAndImportData() {
    this.data = {};
    return Promise.all([
      super.getValidationAndImportData(),
      userRoleRepo.getRolesByUserId(),
      submeasureRepo.getMany()
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_department', 'department_code'),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_department', 'company_code'),
      // pgRepo.getSortedUpperListFromColumn('vw_fds_financial_account', 'financial_account_code'),
    ])
      .then(results => {
        this.data.userRoles = results[1];
        this.data.submeasures = results[2];
        this.data.department = {
          department_codes: [123], //results[3], //todo: fix this postgres down hack.
          company_codes: [456789] //results[4]
        };
        this.data.glAccounts = [62345];// results[5];
      })
  }

  validateRow1(row) {
    this.temp = new DeptUploadDeptTemplate(row);
    this.sheet1SubmeasureNames.push(this.temp.submeasureName);
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        this.validateMeasureAccess(),
        this.validateCanDeptUpload(),
        this.lookForErrors()
      ]))
      .then(() => Promise.all([
        this.validateNodeValue(),
        this.lookForErrors()
      ]));
  }

  validateRow2(row) {
    this.temp = new DeptUploadExludeAcctTemplate(row);
    if (!this.startedSheet2) {
      this.startedSheet2 = true;
      this.sheet1SubmeasureNames = _.sortBy(_.uniq(this.sheet1SubmeasureNames), _.identity)
    }
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        this.validateSubmeasureNameInSheet1(),
        this.validateGlAccount(),
        this.lookForErrors()
      ]));
  }

  validate() {
    return Promise.all([
      this.validateTest(),
      this.lookForErrors('Test Validation Heading')
    ])
    // return Promise.resolve();
  }

  getImportArray() {
    // convert


    const imports = this.rows1.map(row => new DeptUploadImport(row, this.fiscalMonth));
    return Promise.resolve(imports);
  }

  validateCanDeptUpload() {
    if (this.submeasure.indicators.expenseSSOT.toUpperCase() !== 'Y') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow department upload`);
    }
    return Promise.resolve();
  }

  validateNodeValue() {
    const nodeValue = this.temp.nodeValue;
    const re = /^(\d{3})_(\d{6})$/;

    if (!nodeValue) {
      this.addErrorRequired(this.PropNames.nodeValue);
    } else if (!re.test(this.temp.nodeValue)) {
      this.addErrorInvalid(this.PropNames.nodeValue, this.temp.nodeValue);
    } else {
      const arr = this.temp.nodeValue.match(re);
      let deptCode = Number(arr[1]);
      let companyCode = Number(arr[2]);
      if (this.notExists(this.data.department.department_codes, deptCode)) {
        this.addError(this.PropNames.nodeValue, 'Invalid department code', nodeValue);
      }
      if (this.notExists(this.data.department.company_codes, companyCode)) {
        this.addError(this.PropNames.nodeValue, 'Invalid company code', nodeValue);
      }
    }
    return Promise.resolve();
  }

  validateSubmeasureNameInSheet1() {
    if (_.sortedIndexOf(this.sheet1SubmeasureNames, this.temp.submeasureName) === -1) {
      this.addError(this.PropNames.submeasureName, 'No matching submeasure in sheet1', this.temp.submeasureName);
    }
    return Promise.resolve();
  }

  validateGlAccount() {
    const re = /^6\d{4}$/;
    const glAccount = this.temp.glAccount;

    if (!glAccount) {
      this.addErrorRequired(this.PropNames.glAccount);
    } else if (!re.test(this.temp.glAccount)) {
      this.addErrorInvalid(this.PropNames.glAccount, this.temp.glAccount);
    } else if (this.notExists(this.data.glAccounts, glAccount)) {
      this.addErrorInvalid(this.PropNames.glAccount, glAccount);
    }
    return Promise.resolve();
  }


}


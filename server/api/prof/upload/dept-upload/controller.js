const DeptUploadRepo = require('../../dept-upload/repo'),
  DeptUploadDeptTemplate = require('./dept-template'),
  DeptUploadExludeAcctTemplate = require('./exclude-acct-template'),
  DeptUploadImport = require('./import'),
  UploadController = require('../../../../lib/base-classes/upload-controller'),
  SubmeasureRepo = require('../../../../api/common/submeasure/repo'),
  UserRoleRepo = require('../../../../lib/database/repos/user-role-repo')


const repo = new DeptUploadRepo();
const submeasureRepo = new SubmeasureRepo();
const userRoleRepo = new UserRoleRepo();

module.exports = class DeptUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Department Upload';
    this.hasTwoSheets = true;

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
    ])
      .then(results => {
        this.data.userRoles = results[1];
        this.data.submeasures = results[2];
        this.data.department = {
          department_codes: [], //results[3],
          company_codes: [] //results[4]
        };
      })
  }

  validateRow1(row) {
    this.temp = new DeptUploadDeptTemplate(row);
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
    return Promise.resolve();
/*
    this.temp = new DeptUploadExludeAcctTemplate(row);
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        this.validateMeasureAccess(),
        this.validateSubmeasureCanManualUpload(),
        this.validateCanDollarUpload(),
        this.lookForErrors()
      ]))
      .then(() => Promise.all([
        this.validateNodeValue(),
        this.validateInputSalesValue(),
        this.validateGrossUnbilledAccruedRevenueFlag(),
        this.validateInputLegalEntityValue(),
        this.validateInputBusinessEntityValue(),
        this.validateSCMSSegment(),
        this.validateAmount(),
        this.validateRevenueClassification(),
        this.lookForErrors()
      ]));
*/
  }

  validate() {
    return Promise.resolve();
  }

  getImportArray() {
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
      let deptCode = arr[1];
      let companyCode = arr[2];
      if (this.notExists(this.data.department.department_codes, deptCode)) {
        this.addError(this.PropNames.nodeValue, 'Invalid department code',  deptCode);
      }
      if (this.notExists(this.data.department.company_codes, companyCode)) {
        this.addError(this.PropNames.nodeValue, 'Invalid company code',  companyCode);
      }
    }
    return Promise.resolve();
  }

}


const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadTemplate = require('./template'),
  DollarUploadImport = require('./import'),
  NamedApiError = require('../../../lib/common/named-api-error'),
  _ = require('lodash'),
  ApiError = require('../../../lib/common/api-error'),
  UserRoleRepo = require('../../../lib/database/repos/user-role-repo'),
  mail = require('../../../lib/common/mail'),
  OpenPeriodRepo = require('../../common/open-period/repo'),
  InputFilterLevelUploadController = require('../../../lib/base-classes/input-filter-level-upload-controller'),
  PostgresRepo = require('../../../lib/database/repos/postgres-repo');


const repo = new DollarUploadRepo();
const UploadValidationError = 'UploadValidationError';
const openPeriodRepo = new OpenPeriodRepo();
const pgRepo = new PostgresRepo();
const userRoleRepo = new UserRoleRepo();

module.exports = class DollarUploadController extends InputFilterLevelUploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Dollar Upload';

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      inputProductValue: 'Input Product Value',
      inputSalesValue: 'Input Sales Value',
      grossUnbilledAccruedRevenueFlag: 'Gross Unbilled Accrued Revenue Flag',
      inputLegalEntityValue: 'Input Legal Entity Value',
      inputBusinessEntityValue: 'Input Business Entity Value',
      scmsSegment: 'SCMS Segment',
      amount: 'Amount',
      dealId: 'Deal ID',
      revenueClassification: 'Revenue Classification'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ])
  }

  validate(row) {
    this.temp = new DollarUploadTemplate(row);
    this.getSubmeasure();
    this.validateSubmeasureName();
    this.lookForErrors();// get out early as later validation depends on submeasure
    this.validateMeasureAccess();
    this.validateSubmeasureCanManualUpload()
    this.lookForErrors();
    this.validateInputProductValue();
    this.validateInputSalesValue();
    this.validateGrossUnbilledAccruedRevenueFlag();
    this.validateInputLegalEntityValue();
    this.validateInputBusinessEntityValue();
    this.validateSCMSSegment();
    this.validateAmount();
    this.validateRevenueClassification();
  }

  getImportDoc(row) {
    const doc = new DollarUploadImport(row);
    doc.fiscalMonth = this.fiscalMonth;
    return doc;
  }

  validateSubmeasureCanManualUpload() {
    if (this.submeasure.source !== 'manual') {
      this.addError('', `Sub Measure doesn't allow manual upload`);
    }
  }

  validateAmount() {
    if (this.validateNumber(this.PropNames.amount, this.temp.amount, true)) {
      this.temp.amount = Number(this.temp.amount);
    }
  }

  validateRevenueClassification() {
    if (this.temp.revenueClassification &&
      this.notExists(this.data.revClassifications, this.temp.revenueClassification)) {
      this.addErrorInvalid(this.PropNames.revenueClassification, this.temp.revenueClassification);
    }
  }

  getFiscalMonth() {
    return openPeriodRepo.getOneLatest({})
      .then(doc => this.import.fiscalMonth = doc.fiscalMonth);
  }

}


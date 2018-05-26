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
  OpenPeriodRepo = require('../open-period/repo'),
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
      this.getInputFilterLevelValidationData(),
      this.getImportData()
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

  getImportData() {
    openPeriodRepo.getOne()
      .then(doc => this.fiscalMonth = doc.fiscalMonth);
  }

  getImportDoc(row) {
    const doc = new DollarUploadImport(row);
    doc.fiscalMonth = this.fiscalMonth;
    return doc;
  }

  getSubmeasure() {
    this.submeasure = _.find(this.data.submeasures, {name: this.temp.submeasureName});
    return Promise.resolve();
  }

  validateSubmeasureName() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(this.PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(this.PropNames.submeasureName, 'No Sub Measure exists by this name');
    }
    return Promise.resolve();
  }

  validateMeasureAccess() {
    // todo: requires onramp table, this is a temporary placeholder
/*
    return userRoleRepo.userHasRole(this.req.user.id, this.submeasure.measureName)
      .then(hasRole => {
        if (!hasRole) {
          this.addError('', 'Not authorized for this upload.');
        }
      });
*/
    // need to check this with cached data
  }

  validateSubmeasureCanManualUpload() {
    if (this.submeasure.source !== 'manual') {
      this.addError('', `Sub Measure doesn't allow manual upload`);
    }
  }

  validateAmount() {
    if (this.temp.amount === undefined || '') {
      this.addErrorRequired(this.PropNames.amount);
    } else if (Number.isNaN(Number(this.temp.amount))) {
      this.addError(this.PropNames.amount, 'Not a number');
    } else {
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


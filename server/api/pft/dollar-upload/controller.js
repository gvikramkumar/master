const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadTemplate = require('./template'),
  DollarUploadImport = require('./import'),
  NamedApiError = require('../../../lib/common/named-api-error'),
  _ = require('lodash'),
  ApiError = require('../../../lib/common/api-error'),
  userRoleRepo = require('../../../lib/database/repos/user-role-repo'),
  mail = require('../../../lib/common/mail'),
  OpenPeriodRepo = require('../open-period/repo'),
  InputFilterLevelUploadController = require('../../../lib/base-classes/input-filter-level-upload-controller'),
  PostgresRepo = require('../../../lib/database/repos/postgres-repo');


const repo = new DollarUploadRepo();
const UploadValidationError = 'UploadValidationError';
const openPeriodRepo = new OpenPeriodRepo();
const pgRepo = new PostgresRepo();

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
      ScmsSegment: 'SCMS Segment',
      amount: 'Amount',
      dealId: 'Deal ID',
      revenueClassification: 'Revenue Classification'
    }
  }

  getValidationAndImportData() {
    Promise.all([
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
    this.validateProductValue();
    this.validateSalesValue();
    this.validateGrossUnbilledAccruedRevenueFlag();
    this.validatLegalEntityValue();
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
    this.submeasure = _.find(this.submeasures, {name: this.temp.submeasureName});
    return Promise.resolve();
  }

  validateSubmeasureName() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(this.PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(this.PropNames.submeasureName, 'No Sub Measure exists by this name.');
    }
    return Promise.resolve();
  }

  validateMeasureAccess() {
    // todo: requires onramp table, this is a temporary placeholder
    return userRoleRepo.userHasRole(this.req.user.id, this.submeasure.measureName)
      .then(hasRole => {
        if (!hasRole) {
          this.addError('', 'Not authorized for this upload.');
        }
      })
  }

  validateSubmeasureCanManualUpload() {
    if (this.submeasure.source !== 'manual') {
      this.addError('', `Sub Measure doesn't allow manual upload`);
    }
    return Promise.resolve();
  }

  getFiscalMonth() {
    return openPeriodRepo.getOneLatest({})
      .then(doc => this.import.fiscalMonth = doc.fiscalMonth);
  }

}


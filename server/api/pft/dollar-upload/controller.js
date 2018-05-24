const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadTemplate = require('./template'),
  DollarUploadImport = require('./import'),
  NamedApiError = require('../../../lib/common/named-api-error'),
  SubmeasureRepo = require('../submeasure/repo'),
  _ = require('lodash'),
  ApiError = require('../../../lib/common/api-error'),
  userRoleRepo = require('../../../lib/database/repos/user-role-repo'),
  mail = require('../../../lib/common/mail'),
  OpenPeriodRepo = require('../open-period/repo'),
  UploadController = require('../../../lib/base-classes/upload-controller');


const repo = new DollarUploadRepo();
const submeasureRepo = new SubmeasureRepo();
const UploadValidationError = 'UploadValidationError';
const openPeriodRepo = new OpenPeriodRepo();

const PropNames = {
  submeasureName: 'Sub Measure Name',
  inputProductValue: 'Input Product value',
  inputSalesValue: 'Input Sales Value',
  grossUnbilledAccruedRevenueFlag: 'Gross Unbilled Accrued Revenue Flag',
  inputLegalEntityValue: 'Input Legal Entity Value',
  inputBusinessEntityValue: 'Input Business Entity Value',
  ScmsSegment: 'SCMS Segment',
  amount: 'Amount',
  dealId: 'Deal ID',
  revenueClassification: 'Revenue Classification'
}

module.exports = class DollarUploadController extends UploadController {

  constructor() {
    super(repo);
    this.emailTitle = 'Dollar upload validation errors';
  }

  getValidateChain(row) {
    this.temp = new DollarUploadTemplate(row);
    this.submeasure = undefined;
    return this.getSubmeasure()
      .then(() => {
        return this.validateSubmeasureName()
          .then(this.lookForErrors.bind(this))
          .then(() => {
            return Promise.all([
              this.validateMeasureAccess(),
              this.validateSubmeasureCanManualUpload()
            ])
              .then(this.lookForErrors.bind(this))
          })
      })
      .then(() => {
        return Promise.all([
          this.validateProductValue(),
          this.validateSalesValue(),
          this.validateGrossUnbilledAccruedRevenueFlag(),
          this.validatLegalEntityValue(),
          this.validateSCMSSegment(),
          this.validateAmount(),
          this.validateRevenueClassification()
        ])
          .then(this.lookForErrors.bind(this))
      })

  }

  getImportChain(row) {
    debugger;
    this.import = new DollarUploadImport(row);
    this.submeasure = undefined;
    return Promise.all([
      this.getFiscalMonth()
    ]);
  }

  ////////////////////// validators
  getSubmeasure() {
    return submeasureRepo.getOneLatest({name: this.temp.submeasureName})
      .then(submeasure => this.submeasure = submeasure);
  }

  validateSubmeasureName() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(PropNames.submeasureName, 'No Sub Measure exists by this name.');
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

  validateProductValue() {
    // user this.submeasure ?? to determine PL, BU, TU then hit pg to get acceptable values
    // this.addError(PropNames.inputProductValue, 'Validate product value error');
    return Promise.resolve();
  }

  validateSalesValue() {
    // same deal for all these, some submeasure prop to get acceptable values from somewhere
    // this.addError(PropNames.inputSalesValue, 'validateSalesValue error');
    return Promise.resolve();
  }

  validateGrossUnbilledAccruedRevenueFlag() {
    if (!_.includes([undefined, 'Y', 'N'], this.temp.grossUnbilledAccruedRevenueFlag)) {
      this.addError(PropNames.grossUnbilledAccruedRevenueFlag, 'Invalid value, must be: Y/N/NULL');
    }
    return Promise.resolve();
  }

  validatLegalEntityValue() {
    return Promise.resolve();
  }

  validateSCMSSegment() {
    return Promise.resolve();
  }

  validateAmount() {
    if (this.temp.amount === undefined || '') {
      this.addErrorRequired(PropNames.amount);
    } else if (Number.isNaN(Number(this.temp.amount))) {
      this.addError(PropNames.amount, 'Not a number');
    } else {
      this.temp.amount = Number(this.temp.amount);
    }
    return Promise.resolve();
  }

  validateRevenueClassification() {
    return Promise.resolve();
  }

  /////////////////////  importers
  getFiscalMonth() {
    return openPeriodRepo.getOneLatest({})
      .then(doc => this.import.fiscalMonth = doc.fiscalMonth);
  }

}


const DollarUploadRepo = require('../../dollar-upload/repo'),
  DollarUploadTemplate = require('./template'),
  DollarUploadImport = require('./import'),
  OpenPeriodRepo = require('../../../common/open-period/repo'),
  InputFilterLevelUploadController = require('../../../../lib/base-classes/input-filter-level-upload-controller'),
  _ = require('lodash');

const repo = new DollarUploadRepo();
const openPeriodRepo = new OpenPeriodRepo();

module.exports = class DollarUploadController extends InputFilterLevelUploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Dollar Upload';
    this.rowColumnCount = 10;

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

  validateRow1(row) {
    this.temp = new DollarUploadTemplate(row);
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
        this.validateInputProductValue(),
        this.validateInputSalesValue(),
        this.validateGrossUnbilledAccruedRevenueFlag(),
        this.validateInputLegalEntityValue(),
        this.validateInputBusinessEntityValue(),
        this.validateSCMSSegment(),
        this.validateAmount(),
        this.validateRevenueClassification(),
        this.lookForErrors()
      ]));
  }

  validate() {
    return Promise.resolve();
  }

  importRows() {
    this.imports = this.rows1.map(row => new DollarUploadImport(row, this.fiscalMonth));
    return super.importRows();
  }

  validateSubmeasureCanManualUpload() {
    if (this.submeasure.source !== 'manual') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow manual upload`);
    }
    return Promise.resolve();
  }

  validateCanDollarUpload() {
    if (this.submeasure.indicators.dollarUploadFlag.toUpperCase() !== 'Y') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow dollar upload`);
    }
    return Promise.resolve();
  }

  validateGrossUnbilledAccruedRevenueFlag() {
    if (!_.includes([undefined, 'Y', 'N'], this.temp.grossUnbilledAccruedRevenueFlag)) {
      this.addErrorInvalid(this.PropNames.grossUnbilledAccruedRevenueFlag,
        this.temp.grossUnbilledAccruedRevenueFlag, 'Y/N/NULL');
    }
    return Promise.resolve();
  }

  validateAmount() {
    if (this.validateNumber(this.PropNames.amount, this.temp.amount, true)) {
      this.temp.amount = Number(this.temp.amount);
    }
    return Promise.resolve();
  }

  validateRevenueClassification() {
    if (this.temp.revenueClassification &&
      this.notExists(this.data.revClassifications, this.temp.revenueClassification)) {
      this.addErrorInvalid(this.PropNames.revenueClassification, this.temp.revenueClassification);
    }
    return Promise.resolve();
  }

}


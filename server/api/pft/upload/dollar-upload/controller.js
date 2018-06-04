const DollarUploadRepo = require('../../dollar-upload/repo'),
  DollarUploadTemplate = require('./template'),
  DollarUploadImport = require('./import'),
  OpenPeriodRepo = require('../../../common/open-period/repo'),
  InputFilterLevelUploadController = require('../../../../lib/base-classes/input-filter-level-upload-controller');

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

  validate(row) {
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

  validateCanDollarUpload() {
    if (this.submeasure.indicators.dollarUploadFlag.toUpperCase() !== 'Y') {
      this.addError('', `Sub Measure doesn't allow dollar upload`);
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


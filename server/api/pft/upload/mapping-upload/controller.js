const MappingUploadRepo = require('../../mapping-upload/repo'),
  MappingUploadTemplate = require('./template'),
  MappingUploadImport = require('./import'),
  InputFilterLevelUploadController = require('../../../../lib/base-classes/input-filter-level-upload-controller');

const repo = new MappingUploadRepo();

module.exports = class MappingUploadController extends InputFilterLevelUploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Mapping Upload';
    this.rowColumnCount = 7;

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      inputProductValue: 'Input Product Value',
      inputSalesValue: 'Input Sales Value',
      inputLegalEntityValue: 'Input Legal Entity Value',
      inputBusinessEntityValue: 'Input Business Entity Value',
      scmsSegment: 'SCMS Segment',
      percentage: 'Percentage Value'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ])
  }

  validate(row) {
    this.temp = new MappingUploadTemplate(row);
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        this.validateMeasureAccess(),
        this.validateCanMappingUpload(),
        this.lookForErrors()
      ]))
      .then(() => Promise.all([
        this.validateInputProductValue(),
        this.validateInputSalesValue(),
        this.validateInputLegalEntityValue(),
        this.validateInputBusinessEntityValue(),
        this.validateSCMSSegment(),
        this.validatePercentage(),
        this.lookForErrors()
      ]));
  }

  getImportDoc(row) {
    const doc = new MappingUploadImport(row);
    doc.fiscalMonth = this.fiscalMonth;
    return doc;
  }

  validateCanMappingUpload() {
    if (this.submeasure.indicators.manualMapping.toUpperCase() !== 'Y') {
      this.addError('', `Sub Measure doesn't allow mapping upload`);
    }
  }


  validatePercentage() {
    if (this.validateNumber(this.PropNames.percentage, this.temp.percentage, true)) {
      this.temp.percentage = Number(this.temp.percentage);
    }
  }

  validateRevenueClassification() {
    if (this.temp.revenueClassification &&
      this.notExists(this.data.revClassifications, this.temp.revenueClassification)) {
      this.addErrorInvalid(this.PropNames.revenueClassification, this.temp.revenueClassification);
    }
  }

}


const MappingUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/base-classes/controller-base'),
  xlsx = require('node-xlsx'),
  MappingUploadTemplate = require('./template'),
  MappingUploadImport = require('./import'),
  NamedApiError = require('../../../lib/common/named-api-error'),
  _ = require('lodash'),
  ApiError = require('../../../lib/common/api-error'),
  UserRoleRepo = require('../../../lib/database/repos/user-role-repo'),
  mail = require('../../../lib/common/mail'),
  InputFilterLevelUploadController = require('../../../lib/base-classes/input-filter-level-upload-controller'),
  PostgresRepo = require('../../../lib/database/repos/postgres-repo');


const repo = new MappingUploadRepo();
const UploadValidationError = 'UploadValidationError';
const pgRepo = new PostgresRepo();
const userRoleRepo = new UserRoleRepo();

module.exports = class MappingUploadController extends InputFilterLevelUploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Mapping Upload';

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
    this.getSubmeasure();
    this.validateSubmeasureName();
    this.lookForErrors();// get out early as later validation depends on submeasure
    this.validateMeasureAccess();
    this.validateCanMappingUpload()
    this.lookForErrors();
    this.validateInputProductValue();
    this.validateInputSalesValue();
    this.validateGrossUnbilledAccruedRevenueFlag();
    this.validateInputLegalEntityValue();
    this.validateInputBusinessEntityValue();
    this.validateSCMSSegment();
    this.validatePercentage();
    this.validateRevenueClassification();
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


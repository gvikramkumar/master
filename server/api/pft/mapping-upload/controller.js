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
      super.getValidationAndImportData
    ])
  }

  validate(row) {
    this.temp = new MappingUploadTemplate(row);
    this.getSubmeasure();
    this.validateSubmeasureName();
    this.lookForErrors();// get out early as later validation depends on submeasure
    this.validateMeasureAccess();
    // this.validateSubmeasureCanMappingUpload()
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

  validateSubmeasureCanMappingUpload() {
    // todo:
    // requirement says check if submeasure.manualMapping = 'Y', but manualMapping is an object exactly
    // the same as submeasure.inputFilterLevel, either way, probably need some check here, have to verify
/*
    if (this.submeasure.source !== 'manual') {
      this.addError('', `Sub Measure doesn't allow manual upload`);
    }
*/
  }

  validatePercentage() {
    if (this.temp.percentage === undefined || '') {
      this.addErrorRequired(this.PropNames.percentage);
    } else if (Number.isNaN(Number(this.temp.percentage))) {
      this.addError(this.PropNames.percentage, 'Not a number');
    } else {
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


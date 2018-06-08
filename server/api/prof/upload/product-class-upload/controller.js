const ProductClassUploadRepo = require('../../product-class-upload/repo'),
  ProductClassUploadTemplate = require('./template'),
  ProductClassUploadImport = require('./import'),
  _ = require('lodash'),
  UploadController = require('../../../../lib/base-classes/upload-controller'),
  NamedApiError = require('../../../../lib/common/named-api-error');

const repo = new ProductClassUploadRepo();

module.exports = class ProductClassUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'Product Classification Upload';

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      splitCategory: 'Split Category',
      splitPercentage: 'Split Percentage'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ])
  }

  validateRow1(row) {
    this.temp = new ProductClassUploadTemplate(row);
    return Promise.all([
      // this.getSubmeasure(),
      // this.validateSubmeasureName(),
      // this.lookForErrors()
    ])
      .then(() => Promise.all([
        // this.validateMeasureAccess(),
        // this.validateSubmeasureCanManualUpload(),
        // this.validateCanProductClassUpload(),
        // this.lookForErrors()
      ]))
      .then(() => Promise.all([
        // this.validateInputProductValue(),
        // this.validateInputSalesValue(),
        // this.validateGrossUnbilledAccruedRevenueFlag(),
        // this.validateInputLegalEntityValue(),
        // this.validateInputBusinessEntityValue(),
        // this.validateSCMSSegment(),
        // this.validateAmount(),
        // this.validateRevenueClassification(),
        // this.lookForErrors()
      ]));
  }

  validate() {
    // sort by submeasureName, add up splitPercentage, error if not 1.0
    const arr = _.sortBy(this.rows1.map(row => new ProductClassUploadTemplate(row)), 'submeasureName');
    const obj = {};
    arr.forEach(val => {
      if (obj[val.submeasureName]) {
        obj[val.submeasureName] += val.splitPercentage;
      } else {
        obj[val.submeasureName] = val.splitPercentage;
      }
    });
    _.forEach(obj, (val, key) => {
      if (val !== 1.0) {
        this.addError(key, val);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Submeasure Percentage Errors', this.errors));
    }
    return Promise.resolve();
  }

  getImportArray() {
    const imports = this.rows1.map(row => new ProductClassUploadImport(row, this.fiscalMonth));
    return Promise.resolve(imports);
  }

}


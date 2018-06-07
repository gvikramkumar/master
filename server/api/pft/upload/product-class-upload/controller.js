const ProductClassUploadRepo = require('../../product-class-upload/repo'),
  ProductClassUploadTemplate = require('./template'),
  ProductClassUploadImport = require('./import'),
  _ = require('lodash'),
  UploadController = require('../../../../lib/base-classes/upload-controller');

const repo = new ProductClassUploadRepo();

module.exports = class ProductClassUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'ProductClass Upload';
    this.rowColumnCount = 10;

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
    const arr = this.rows1.map(row => new ProductClassUploadTemplate(row));
    const obj = {};
    arr.forEach(val => {
      if (obj[val.submeasureName]) {
        obj[val.submeasureName].total += val.splitPercentage;
      } else {
        obj[val.submeasureName].total = val.splitPercentage;
      }
    });
    _.forEach(obj, (val, key) => {
      if (val !== 1.0) {
        this.addError(key, val);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new ApiError('Submeasure Percentage Errors', this.errors));
    }
    return Promise.resolve();
  }

  importRows() {
    this.imports = this.rows1.map(row => new ProductClassUploadImport(row, this.fiscalMonth));
    return super.importRows();
  }

}


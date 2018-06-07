const SalesSplitUploadRepo = require('../../sales-split-upload/repo'),
  SalesSplitUploadTemplate = require('./template'),
  SalesSplitUploadImport = require('./import'),
  _ = require('lodash'),
  UploadController = require('../../../../lib/base-classes/upload-controller');

const repo = new SalesSplitUploadRepo();

module.exports = class SalesSplitUploadController extends UploadController {

  constructor() {
    super(repo);
    this.uploadName = 'SalesSplit Upload';
    this.rowColumnCount = 10;

    this.PropNames = {
      accountId: 'Account ID',
      companyCode: 'Company Code',
      salesTerritoryCode: 'Sales Territory Code',
      splitPercentage: 'Percentage Value'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ])
  }

  validateRow1(row) {
    this.temp = new SalesSplitUploadTemplate(row);
    return Promise.all([
      // this.getSubmeasure(),
      // this.validateSubmeasureName(),
      // this.lookForErrors()
    ])
      .then(() => Promise.all([
        // this.validateMeasureAccess(),
        // this.validateSubmeasureCanManualUpload(),
        // this.validateCanSalesSplitUpload(),
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
    return Promise.resolve();
  }

  importRows() {
    this.imports = [];
    // maybe this happens in getValidationAndImportData instead??
    // have no idea what the query looks like and pg table doesn't exist yet
/*
    getSubAccountCodeDataFromUploadData()
      .then(subaccts => {
        this.rows1.forEach(row => {
          _.filter(subaccts, {x: row[?], y: row[?]})
            .forEach(sa => {
              this.imports.push(new SalesSplitUploadImport(row, this.fiscalMonth, sa.subAccountCode));
          })
        });
        return super.importRows();
      })
*/
  }

}


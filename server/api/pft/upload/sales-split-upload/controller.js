const SalesSplitUploadRepo = require('../../dollar-upload/repo'),
  SalesSplitUploadTemplate = require('./template'),
  SalesSplitUploadImport = require('./import'),
  OpenPeriodRepo = require('../../../common/open-period/repo'),
  InputFilterLevelUploadController = require('../../../../lib/base-classes/input-filter-level-upload-controller'),
  _ = require('lodash');

const repo = new SalesSplitUploadRepo();
const openPeriodRepo = new OpenPeriodRepo();

module.exports = class SalesSplitUploadController extends InputFilterLevelUploadController {

  constructor() {
    super(repo);
    this.uploadName = 'SalesSplit Upload';
    this.rowColumnCount = 10;

    this.PropNames = {
      accountId: '*Account ID',
      companyCode: 'Company Code',
      salesTerritoryCode: '*Sales Territory Code',
      splitPercentage: '*Percentage Value'
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ])
  }

  validate(row) {
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

  importRows() {
    this.imports = [];
    // maybe this happens in getValidationAndImportData instead??
    // have no idea what the query looks like and pg table doesn't exist yet
/*
    getSubAccountCodeDataFromUploadData()
      .then(subaccts => {
        this.rows.forEach(row => {
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


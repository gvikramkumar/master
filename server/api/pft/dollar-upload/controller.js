const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadTemplate = require('./template'),
  DollarUploadImport = require('./import'),
  NamedApiError = require('../../../lib/common/named-api-error'),
  SubmeasureRepo = require('../submeasure/repo'),
  _ = require('lodash'),
  GridFSBucket = require('../../../lib/common/gridfs-bucket'),
  enums = require('../../../lib/models/enums'),
  FileRepo = require('../../common/file/repo'),
  ApiError = require('../../../lib/common/api-error');

const repo = new DollarUploadRepo();
const submeasureRepo = new SubmeasureRepo();
const fileRepo = new FileRepo();
const gfs = new GridFSBucket();

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

module.exports = class DollarUploadController extends ControllerBase {


  constructor() {
    super(repo);
  }

  upload(req, res, next) {
    this.req = req;
    this.userId = req.user.id;
    const sheets = xlsx.parse(req.file.buffer);
    this.rows = sheets[0].data.slice(5).filter(row => row.length > 1); // might be comment row in there
    this.totalErrors = {};
    this.hasTotalErrors = false;

    this.validateRows()
      .then(() => {
        if (this.hasTotalErrors) {
          return Promise.reject(new NamedApiError('UploadValidationError', 'There were validation errors in the upload. No records have been imported. An email was sent documenting the errors.', this.totalErrors, 400));
        }
      })
      .then(() => {
        return this.importRows()
          .then(() => {
            res.send(this.imports);
          })
      })
      .catch(next);

  }

  validateRows() {
    let chain = Promise.resolve();

    this.rows.forEach((row, idx) => {
      chain = chain.then(() => this.validateRow(row, idx + 1));
    });
    return chain;
  }

  addError(property, message) {
    this.errors.push({property, error: message});
  }

  addErrorRequired(property) {
    this.addError(property, 'Required')
  }

  validateRow(row, rowNum) {
    this.errors = [];
    this.rowNum = rowNum;
    this.temp = new DollarUploadTemplate(row);
    this.submeasure = undefined;

    return this.getSubmeasure()
      .then(() => {
        return this.validateSubmeasureName()
          .then(() => this.lookForErrors())
          .then(() => {
            return Promise.all([
              this.validateMeasureAccess(),
              this.validateSubmeasureCanManualUpload()
            ])
          });
      })
      .then(() => this.lookForErrors())
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
          .then(() => this.lookForErrors())
          .catch(err => Promise.reject(err));
      })
      .catch(err => {
        if (err.name === 'UploadValidationError') {
          this.totalErrors[this.rowNum] = err.data;
          this.hasTotalErrors = true;
        } else {
          Promise.reject(err);
        }
      })

  }

  lookForErrors() {
    if (this.errors.length) {
      return Promise.reject(new NamedApiError('UploadValidationError', null, _.sortBy(this.errors, 'property')));
    }
    return Promise.resolve();
  }

  validateMeasureAccess() {
    // todo: requires onramp table
    return Promise.resolve();
  }

  getSubmeasure() {
    return submeasureRepo.getOneByNameLatest(this.temp.submeasureName)
      .then(submeasure => this.submeasure = submeasure);
  }

  validateSubmeasureCanManualUpload() {
    if (this.submeasure.source !== 'manual') {
      return Promise.reject(new ApiError(`Sub Measure doesn't allow manual upload`));
    }
    return Promise.resolve();
  }

  validateSubmeasureName() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(PropNames.submeasureName, 'No Sub Measure exists by this name.');
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

  importRows() {
    this.imports = [];

    let chain = Promise.resolve();
    this.rows.forEach((row, idx) => {
      chain = chain.then(() => this.importRow(row, idx + 1));
    });
    return chain;
  }

  importRow(row, rowNum) {
    this.rowNum = rowNum;
    this.import = new DollarUploadImport(row);
    this.submeasure = undefined;

    return this.getSubmeasure()
      .then(() => {
        return Promise.all([])// the list of import operations to get all the data
          .catch(err => Promise.reject(err));
      })
      .then(() => {
        return repo.add(this.import, this.req.user.id)
          .then(doc => this.imports.push(doc));
      })
  }


}


const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadImport = require('./template'),
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

    this.validateRows()
      .then(() => {
        return this.importRows()
          .then(() => {
            res.send(this.imports);
          })
      })
      .catch(next)

    // validate and if cool, then do mongo.Grid???.createWriteStream()... and get id back hopefully
    // if not fs.fileInfo, then use the id to get that and return.

    // return this.repo.getOneById(.file.id))
    //   .then(files => res.send(files))
    //   .catch(next);

  }

  validateRows() {
    let chain = Promise.resolve();
    this.rows.forEach((row, idx) => {
      chain = chain.then(() => this.validateRow(row, idx + 1));
    });
    return chain;
  }

  importRows() {
    this.imports = [];


    // have this.rows, but lost this.temp (grrr) cause it's fixing some values right? Don't want you
    // importing till all rows are deemed valid, no mixed state, all mkae it or none, otherwise you'll have
    // to inform them which made it and which didn't (not gonna happen).
    // probably a lot of work involved in taking 10 cols >> 20 cols insert into db, so do one at a time and
    // put them together, then insert. Thing is: all can be done at same time. BUT... what about stuff like
    // duplicate name or index constraint failures?? So need to show which row fails. With that knowledge and
    // knowing they're done sequentially, they'll know what made it and what didn't. Only if you tell them though.
    // Probably best to do sequentially again. Makes debugging easier as you know where things went bad, it's anyone's
    // guess with promise.all.

    let chain = Promise.resolve();
    this.rows.forEach((row, idx) => {
      chain = chain.then(() => this.importRow(row, idx + 1));
    });
    return chain;
  }

  importRow(row, rowNum) {
    this.rowNum = rowNum;
    this.temp = new DollarUploadImport(row);
    this.submeasure = undefined;

    return this.getSubmeasure()
      .then(() => {
        return Promise.all([])// the list of import operations to get all the data
          .catch(err => Promise.reject(err));
      })
      .then(() => {
        return repo.add(this.temp, this.req.user.id)
          .then(doc => this.imports.push(doc));
      })
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
    this.temp = new DollarUploadImport(row);
    this.submeasure = undefined;

    return this.getSubmeasure()
      .then(() => {
        return this.validateSubmeasureCanManualUpload();
      })
      .then(() => {
        return Promise.all([
          this.validateSubmeasureName(),
          this.validateProductValue(),
          this.validateSalesValue(),
          this.validateGrossUnbilledAccruedRevenueFlag(),
          this.validatLegalEntityValue(),
          this.validateSCMSSegment(),
          this.validateAmount(),
          this.validateRevenueClassification()
        ])
          .then(() => {
            if (this.errors.length) {
              return Promise.reject(new NamedApiError('UploadValidationError',
                `Validation Errors in row: ${rowNum}`, _.sortBy(this.errors, 'property'), 400));
            }
          })
          .catch(err => Promise.reject(err));
      })
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
      return Promise.resolve();
    } else if (!this.submeasure) {
      this.addError(PropNames.submeasureName, 'No Sub Measure exists by this name.');
      return Promise.resolve();
    } else {
      return this.userHasAccessToMeasure();
    }
  }

  userHasAccessToMeasure() {
    // use this.req.user.userId and this.temp.submeasureName to get measure (from where?)
    // and then goto onramp table to see if they have access to measure
    // this.addError(PropNames.submeasureName, `User doesn't have access to measure: ${'??'}`);
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

  convertGrossUnbilledAccruedRevenueFlag() {
    let flag;
    if (_.isNull(this.temp.grossUnbilledAccruedRevenueFlag)) {
      flag = null;
    } else if (typeof this.temp.grossUnbilledAccruedRevenueFlag === 'string') {
      flag = this.temp.grossUnbilledAccruedRevenueFlag.toUpperCase();
      if (flag === 'NULL') {
        flag = null;
      }
    }
    if (flag !== undefined) {
      this.temp.grossUnbilledAccruedRevenueFlag = flag;
    }
  }

  validateGrossUnbilledAccruedRevenueFlag() {
    this.convertGrossUnbilledAccruedRevenueFlag();
    const flag = this.temp.grossUnbilledAccruedRevenueFlag;
    if (!_.includes([null, 'Y', 'N'], flag)) {
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


}


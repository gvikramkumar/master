const DollarUploadRepo = require('./repo'),
  ControllerBase = require('../../../lib/models/controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadTemplate = require('./template'),
  DollarUploadImport = require('./import'),
  NamedApiError = require('../../../lib/common/named-api-error'),
  SubmeasureRepo = require('../submeasure/repo'),
  _ = require('lodash'),
  ApiError = require('../../../lib/common/api-error'),
  userRoleRepo = require('../../../lib/database/user-role-repo'),
  mail = require('../../../lib/common/mail');


const repo = new DollarUploadRepo();
const submeasureRepo = new SubmeasureRepo();
const UploadValidationError = 'UploadValidationError';

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
          return mail.send(
            'dakahle@cisco.com',
            'dakahle@cisco.com',
            'Dollar upload validation errors',
            null,
            this.buildEmailBody())
            // JSON.stringify(this.totalErrors, null, 2))
            .then(() => {
              return Promise.reject(new NamedApiError(UploadValidationError, 'There were validation errors in the upload. No records have been imported. An email was sent documenting the errors.', this.totalErrors, 400));
            })
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
          .then(this.lookForErrors.bind(this))
          .then(() => {
            return Promise.all([
              this.validateMeasureAccess(),
              this.validateSubmeasureCanManualUpload()
            ])
          });
      })
      .then(this.lookForErrors.bind(this))
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
          .then(this.lookForErrors.bind(this))
          .catch(err => Promise.reject(err));
      })
      .catch(err => {
        if (err.name === UploadValidationError) {
          this.totalErrors['Row ' + this.rowNum] = err.data;
          this.hasTotalErrors = true;
        } else {
          Promise.reject(err);
        }
      })

  }

  // look for errors and if any, reject the error to get out.
  // this is also our "break out of validations" as some errors force us to stop checking now as later validations
  // depend on former ones being successful. If we see errors at this point, the reject will discontinue
  // validations for this record.
  lookForErrors() {
    if (this.errors.length) {
      return Promise.reject(new NamedApiError(UploadValidationError, null, _.sortBy(this.errors, 'property')));
    }
    return Promise.resolve();
  }

  validateMeasureAccess() {
    // todo: requires onramp table, this is a temporary placeholder
    return userRoleRepo.userHasRole(this.req.user.id, 'Indirect Revenue Adjustments')
      .then(hasRole => {
        if (!hasRole) {
          this.addError('', 'Not authorized for this upload.');
        }
      })
  }

  getSubmeasure() {
    return submeasureRepo.getOneLatest({name: this.temp.submeasureName})
      .then(submeasure => this.submeasure = submeasure);
  }

  validateSubmeasureCanManualUpload() {
    if (this.submeasure.source !== 'manual') {
      this.addError('', `Sub Measure doesn't allow manual upload`);
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
        return Promise.all([getFiscalMonth()])// the list of import operations to get all the data
          .catch(err => Promise.reject(err));
      })
      .then(() => {
        return repo.add(this.import, this.req.user.id)
          .then(doc => this.imports.push(doc));
      })
  }

  getFiscalMonth() {
    // todo: hit arindam's open_period table.fiscalMonth, but MAKE SURE YOU DON'T HAVE TO HAVE open=Y first
    return Promise.resolve(201809);
  }

  buildEmailBody() {
    let first = true;
    let body = '';
    _.forEach(this.totalErrors, (val, key) => {
      if (first) {
        first = false;
        body += '<br>';
      } else {
        body += '<br><br>';
      }
      body += '<div style="font-size:18px;">' + key + ' Errors</div><hr><table>';
      val.forEach(err => {
        if (err.property) {
          body += `<tr><td style="width: 330px; margin-right: 30px">${err.property}:</td>
                <td style="width: 330px;">${err.error}</td></tr>`
        } else {
          body += `<tr><td colspan="2" style="width:690px">* ${err.error}</td></tr>`
        }
      })
      body += '</table>'
    });
    return body;
  }

}


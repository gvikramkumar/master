const xlsx = require('node-xlsx'),
  NamedApiError = require('../common/named-api-error'),
  ApiError = require('../common/api-error'),
  _ = require('lodash'),
  mail = require('../common/mail'),
  OpenPeriodRepo = require('../../api/common/open-period/repo');

const openPeriodRepo = new OpenPeriodRepo();

module.exports = class UploadController {

  constructor(repo) {
    this.repo = repo;
    this.UploadValidationError = 'UploadValidationError'
    this.data = {};
  }

  upload(req, res, next) {
    this.startUpload = Date.now();
    this.req = req;
    this.userId = req.user.id;
    const sheets = xlsx.parse(req.file.buffer);
    this.rows1 = sheets[0].data.slice(5).filter(row => row.length > 0);
    this.rows2 = [];
    if (this.hasTwoSheets) {
      this.rows2 = sheets[1].data.slice(5).filter(row => row.length > 0);
    }
    this.totalErrors = {};
    this.hasTotalErrors = false;
    if (this.rows1.length === 0) {
      next(new ApiError('No records to upload. Please use the appropriate upload template, entering records after line 5.', null, 400));
      return;
    }

    this.getValidationAndImportData()
      .then(() => this.validateRows(1, this.rows1))
      .then(() => this.validateRows(2, this.rows2))
      .then(() => this.validateOther())
      .then(() => this.lookForTotalErrors())
      .then(() => this.importRows())
      .then(() => {
        this.sendSuccessEmail();
        res.send({status: 'success', uploadName: this.uploadName, rowCount: this.rows1.length});
      })
      .catch(err => {
        if (err && err.name === this.UploadValidationError) {
          this.sendValidationEmail();
          res.send({status: 'fail'});
        } else {
          const data = Object.assign({}, err);
          if (err.message) {
            data.message = err.message;
          }
          if (err.stack) {
            data.stack = err.stack;
          }
          const _err = new ApiError(`Unexpected ${this.uploadName} error`, data);
          this.sendErrorEmail(_err);
          next(_err);
        }
      });
  }

  validateRows(sheet, rows) {
    let chain = Promise.resolve();
    rows.forEach((row, idx) => {
      chain = chain.then(() => this.validateRow(sheet, row, idx + 6));
    });
    return chain;
  }

  validateRow(sheet, row, rowNum) {
    this.errors = [];
    this.rowNum = rowNum;

    return this['validateRow' + sheet](row)
      .catch(err => {
        if (err.name === this.UploadValidationError) {
          let key;
          if (this.hasTwoSheets) {
            key = `Sheet ${sheet} - Row ${this.rowNum}`;
          } else {
            key = `Row ${this.rowNum}`;
          }
          this.totalErrors[key] = err.data;
          this.hasTotalErrors = true;
          if (Object.keys(this.totalErrors).length > 99) {
            return Promise.reject(err); // send validation email
          }
        } else {
          return Promise.reject(err); // send error email
        }
      })
  }

  validateOther() {
    this.errors = [];

    return this.validate()
      .catch(err => {
        if (err.name === this.UploadValidationError) {
          this.totalErrors[err.message] = err.data;
          this.hasTotalErrors = true;
        } else {
          return Promise.reject(err); // send error email
        }
      })
  }

  importRows() {
    return this.getImportArray()
      .then(imports => this.repo.addManyTransaction(imports))
  }

  lookForErrors() {
    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, null, _.sortBy(this.errors, 'property')));
    }
    return Promise.resolve();
  }

  lookForTotalErrors() {
    if (this.hasTotalErrors) {
      return Promise.reject(new NamedApiError(this.UploadValidationError));
    }
    return Promise.resolve();
  }

  getValidationAndImportData() {
    return Promise.all([
      openPeriodRepo.getOne()
        .then(doc => this.fiscalMonth = doc.fiscalMonth)
    ]);
  }

  sendEmail(title, body) {
    return mail.send(
      this.req.user.email,
      this.req.user.email,
      title,
      null,
      body
    );
  }

  sendErrorEmail(err) {
    this.sendEmail(`${this.uploadName} - Error`, this.buildErrorEmailBody(err));
  }

  sendValidationEmail() {
    this.sendEmail(`${this.uploadName} - Validation Errors`, this.buildValidationEmailBody());
  }

  sendSuccessEmail() {
    this.sendEmail(`${this.uploadName} - Success`, this.buildSuccessEmailBody());
  }

  buildSuccessEmailBody() {
    return `<div>${this.rows1.length} rows successfully processed.</div>`
  }

  buildErrorEmailBody(err) {
    return `
    <div>${err.message}</div>
    <pre>
      ${JSON.stringify(err.data, null, 2)}
    </pre>`
  }

  buildValidationEmailBody() {
    let first = true;
    let body = '';
    _.forEach(this.totalErrors, (val, key) => {
      if (first) {
        first = false;
        body += '<br>';
      } else {
        body += '<br><br>';
      }
      body += '<div style="font-size:18px;">' + key + '</div><hr style="width: 960px;text-align:left;"><table>';
      val.forEach(err => {
        if (err.property) {
          let append = `<tr><td style="width: 300px; margin-right: 30px">${err.property}:</td>
                <td style="width: 300px; margin-right: 30px">${err.error}</td>`;
          if (err.value) {
            append += `<td style="width: 300px;">${err.value}</td>`
          }
          append += '</tr>';
          body += append;
        } else {
          body += `<tr><td colspan="2" style="width:630px">* ${err.error}</td></tr>`
        }
      })
      body += '</table>'
    });
    return body;
  }

  /*
  Error display:
  originally written just to cater to row validation so displayed like:
  Row X
  prop error value? // with the errors in an array of prop/error/value?
  we can call addErrorMessageOnly and will combing first 2 columns and prefix message with "* " for
  errors that don't pertain to rows
  For validateOther, we will reuse the row scenario, with the "Row X" replaced with a error title and
  the errors listed in an array of {property, error, value?} just reusing these properties. If we need
  errorMessageOnly, maybe drop the "* " prefix as it won't look right there?
   */

  addError(property, message, value) {
    const obj = {property, error: message};
    if (value) {
      obj.value = value;
    }
    this.errors.push(obj);
  }

  // comines the first 2 columns and places this message in it with a * in front
  // this make it stand out from the property/message/value? errors and gives it more room.
  addErrorMessageOnly(message) {
    this.addError('', message);
  }

  addErrorRequired(property) {
    this.addError(property, 'Required')
  }

  addErrorInvalid(property, value, acceptableValues) {
    let msg = 'Invalid value';
    if (acceptableValues) {
      msg += ` (${acceptableValues})`;
    }
    this.addError(property, msg, value)
  }

  addErrorRequiredForItem(property, item) {
    this.addError(property, `${property} is required for this ${item}`)
  }

  addErrorRequiredForSubmeasure(property) {
    this.addErrorRequiredForItem(property, 'submeasure');
  }

  addErrorNotAllowedForItem(property, item) {
    this.addError(property, `${property} is not allowed for this ${item}`)
  }

  addErrorNotAllowedForSubmeasure(property) {
    this.addErrorNotAllowedForItem(property, 'submeasure');
  }

  notExists(values, value) {
    if (typeof value === 'string') {
      value = value.toUpperCase();
    }
    return _.sortedIndexOf(values, value) === -1;
  }

  validateNumber(prop, val, required) {
    if (required && (val === undefined || val === '')) {
      this.addErrorRequired(prop);
      return false;
    } else if (Number.isNaN(Number(val))) {
      this.addError(prop, 'Not a number', val);
      return false;
    }
    return true;
  }

  getSubmeasure() {
    this.submeasure = _.find(this.data.submeasures, {name: this.temp.submeasureName});
    return Promise.resolve();
  }

  validateSubmeasureName() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(this.PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(this.PropNames.submeasureName, 'No Sub Measure exists by this name', this.temp.submeasureName);
    }
    return Promise.resolve();
  }

  validateMeasureAccess() {
    // todo: requires onramp table, this is a temporary placeholder
    /*
        return userRoleRepo.userHasRole(this.req.user.id, this.submeasure.measureName)
          .then(hasRole => {
            if (!hasRole) {
              this.addError('', 'Not authorized for this upload.');
            }
          });
    */
    // need to check this with cached data
    return Promise.resolve();
  }


}


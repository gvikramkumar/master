const DollarUploadRepo = require('../../api/pft/dollar-upload/repo'),
  ControllerBase = require('./controller-base'),
  xlsx = require('node-xlsx'),
  DollarUploadTemplate = require('../../api/pft/dollar-upload/template'),
  DollarUploadImport = require('../../api/pft/dollar-upload/import'),
  NamedApiError = require('../common/named-api-error'),
  SubmeasureRepo = require('../../api/pft/submeasure/repo'),
  _ = require('lodash'),
  ApiError = require('../common/api-error'),
  userRoleRepo = require('../database/repos/user-role-repo'),
  mail = require('../common/mail'),
  OpenPeriodRepo = require('../../api/pft/open-period/repo');


const UploadValidationError = 'UploadValidationError';

module.exports = class UploadController extends ControllerBase {

  constructor(repo) {
    super(repo);
  }

  upload(req, res, next) {
    this.req = req;
    this.userId = req.user.id;
    const sheets = xlsx.parse(req.file.buffer);
    this.rows = sheets[0].data.slice(5).filter(row => row.length > 1); // might be comment row in there
    this.totalErrors = {};
    this.hasTotalErrors = false;

    this.getValidationData()
      .then(() => res.end())
      .then(() => this.validateRows())
      .then(() => {
        if (this.hasTotalErrors) {
          this.sendValidationEmail();
        }
      })
      .then(() => {
        return this.importRows();
      })
      .then(() => {
        if (!this.hasTotalErrors) {
          this.sendSuccessEmail();
        }
      })
      .catch(err => {
        this.sendErrorEmail(err);
      });

  }

  validateRows() {
    this.rows.forEach((row, idx) => {
      this.validateRow(row, idx + 1);
    });
    return Promise.resolve();
  }

  validateRow(row, rowNum) {
    this.errors = [];
    this.rowNum = rowNum;

    try {
      this.validate(row);
      this.lookForErrors();
    } catch (err) {
      if (err.name === UploadValidationError) {
        this.totalErrors['Row ' + this.rowNum] = err.data;
        this.hasTotalErrors = true;
      } else {
        throw err;
      }
    }
    return Promise.resolve();
  }

  lookForErrors() {
    if (this.errors.length) {
      throw new NamedApiError(UploadValidationError, null, _.sortBy(this.errors, 'property'));
    }
  }

  importRows() {
    const imports = this.rows.map(row => this.getImportDoc(row));
    return this.repo.addMany(imports);
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
    this.sendEmail(`${this.uploadName} Upload Error`, this.buildErrorEmailBody(err));
  }

  sendValidationEmail() {
    this.sendEmail(`${this.uploadName} Validation Errors`, this.buildValidationEmailBody());
  }

  sendSuccessEmail() {
    this.sendEmail(`${this.uploadName} Success`, this.buildSuccessEmailBody());
  }

  buildSuccessEmailBody() {
    return `<div>${this.rows.length} records successfully uploaded.</div>`
  }

  buildErrorEmailBody(err) {
    const obj = Object.assign({}, err);
    if (err.message) {
      obj.message = err.message;
    }
    return `
    <div>An unexpected error occured during upload:</div>
    <pre>
      ${JSON.stringify(obj, null, 2)}
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
      body += '<div style="font-size:18px;">' + key + ' Errors</div><hr><table>';
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

  addError(property, message, value) {
    const obj = {property, error: message};
    if (value) {
      obj.value = value;
    }
    this.errors.push(obj);
  }

  addErrorRequired(property) {
    this.addError(property, 'Required.')
  }

  addErrorInvalid(property, value) {
    this.addError(property, 'Invalid value.', value)
  }

  addErrorRequiredForItem(property, item) {
    this.addError(property, `${property} is required for this ${item}.`)
  }

  addErrorRequiredForSubmeasure(property) {
    this.addErrorRequiredForItem(property, 'submeasure');
  }

  addErrorNotAllowedForItem(property, item) {
    this.addError(property, `${property} is not allowed for this ${item}.`)
  }

  addErrorNotAllowedForSubmeasure(property) {
    this.addErrorNotAllowedForItem(property, 'submeasure');
  }

}


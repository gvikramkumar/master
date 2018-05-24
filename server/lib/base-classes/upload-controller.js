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

    this.validateRows()
      .then(() => {
        if (this.hasTotalErrors) {
          return mail.send(
            'dakahle@cisco.com',
            'dakahle@cisco.com',
            this.emailTitle,
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

    return this.getValidateChain(row)
      .catch(err => {
        if (err.name === UploadValidationError) {
          this.totalErrors['Row ' + this.rowNum] = err.data;
          this.hasTotalErrors = true;
        } else {
          Promise.reject(err);
        }
      })
  }

  // break out promise chain if errors
  lookForErrors() {
    if (this.errors.length) {
      return Promise.reject(new NamedApiError(UploadValidationError, null, _.sortBy(this.errors, 'property')));
    }
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
    return this.getImportChain(row)
      .then(() => {
        return this.repo.add(this.import, this.req.user.id)
          .then(doc => this.imports.push(doc));
      })
      .catch(err => Promise.reject(err));
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


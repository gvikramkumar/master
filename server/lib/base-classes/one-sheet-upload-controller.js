const xlsx = require('node-xlsx'),
  NamedApiError = require('../common/named-api-error'),
  ApiError = require('../common/api-error'),
  _ = require('lodash'),
  mail = require('../common/mail'),
  OpenPeriodRepo = require('../../api/common/open-period/repo'),
  UploadController = require('./upload-controller');

const UploadValidationError = 'UploadValidationError';
const openPeriodRepo = new OpenPeriodRepo();

module.exports = class OneSheetUploadController extends UploadController {

  constructor(repo) {
    super(repo);
  }

  upload(req, res, next) {
    this.startUpload = Date.now();
    this.req = req;
    this.userId = req.user.id;
    const sheets = xlsx.parse(req.file.buffer);
    this.rows = sheets[0].data.slice(5).filter(row => row.length > 1); // might be comment row in there
    this.totalErrors = {};
    this.hasTotalErrors = false;
    if (this.rows.length < 1) {
      next(new ApiError('No records to upload. Please use the appropriate upload template, entering records after line 5.', null, 400));
      return;
    } else if (!(this.rowColumnCount === Object.keys(this.rows[0]).length)) {
      next(new ApiError(`Incorrect column count for ${this.uploadName}. Are you sending up the correct template?`, null, 400));
      return;
    } else {
      res.end();
    }

    this.getValidationAndImportData()
      .then(() => {
        return this.validateRows()
          .then(() => {
            if (this.hasTotalErrors) {
              return Promise.reject(new NamedApiError(UploadValidationError));
            }
          })
      })
      .then(() => this.importRows())
      .then(() => this.sendSuccessEmail())
      .catch(err => {
        if (err && err.name === UploadValidationError) {
          this.sendValidationEmail();
        } else {
          this.sendErrorEmail(err);
        }
      });

  }

  validateRows() {
    let chain = Promise.resolve();

    this.rows.forEach((row, idx) => {
      chain = chain.then(() => this.validateRow(row, idx + 6));
    });
    return chain;
  }

  validateRow(row, rowNum) {
    this.errors = [];
    this.rowNum = rowNum;

    return this.validate(row)
      .catch(err => {
        if (err.name === UploadValidationError) {
          this.totalErrors['Row ' + this.rowNum] = err.data;
          this.hasTotalErrors = true;
          if (Object.keys(this.totalErrors).length > 99) {
            return Promise.reject(err); // send validation email
          }

        } else {
          return Promise.reject(err); // send error email
        }
      })
  }

  importRows() {
    const imports = this.rows.map(row => this.getImportDoc(row));
    return this.repo.addManyTransaction(imports);
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
      body += '<div style="font-size:18px;">' + key + '</div><hr><table>';
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

}


const NamedApiError = require('../common/named-api-error'),
  _ = require('lodash'),
  mail = require('../common/mail'),
  OpenPeriodRepo = require('../../api/common/open-period/repo');

const UploadValidationError = 'UploadValidationError';
const openPeriodRepo = new OpenPeriodRepo();

module.exports = class UploadController {

  constructor(repo) {
    this.repo = repo;
  }

  lookForErrors() {
    if (this.errors.length) {
      return Promise.reject(new NamedApiError(UploadValidationError, null, _.sortBy(this.errors, 'property')));
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
    this.sendEmail(`${this.uploadName} - Upload Error`, this.buildErrorEmailBody(err));
  }

  sendValidationEmail() {
    this.sendEmail(`${this.uploadName} - Validation Errors`, this.buildValidationEmailBody());
  }

  sendSuccessEmail() {
    this.sendEmail(`${this.uploadName} - Success`, this.buildSuccessEmailBody());
  }

  buildSuccessEmailBody() {
    const duration = Math.round((Date.now() - this.startUpload) / 1000);
    return `<div>${this.rows.length} records successfully uploaded in ${duration} seconds.</div>`
  }

  buildErrorEmailBody(err) {
    const obj = Object.assign({}, err);
    if (err.message) {
      obj.message = err.message;
    }
    if (err.stack) {
      obj.stack = err.stack;
    }
    return `
    <div>An unexpected error occured during upload:</div>
    <pre>
      ${JSON.stringify(obj, null, 2)}
    </pre>`
  }

  addError(property, message, value) {
    const obj = {property, error: message};
    if (value) {
      obj.value = value;
    }
    this.errors.push(obj);
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
    return _.sortedIndexOf(values, value.toUpperCase()) === -1;
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

}


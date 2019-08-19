import xlsx from 'node-xlsx';
import {NamedApiError} from '../common/named-api-error';
import {ApiError} from '../common/api-error';
import _ from 'lodash';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import RepoBase from './repo-base';
import ApiRequest from '../models/api-request';
import AnyObj from '../../../shared/models/any-obj';
import OpenPeriodRepo from '../../api/common/open-period/repo';
import DfaUser from '../../../shared/models/dfa-user';
import {svrUtil} from '../common/svr-util';
import {ApiDfaData} from '../middleware/add-global-data';
import {SyncMap} from '../../../shared/models/sync-map';
import {shUtil} from '../../../shared/misc/shared-util';
import {mail} from '../common/mail';


export default class UploadController {
  uploadType: string;
  UploadValidationError = 'UploadValidationError';
  data: AnyObj = {};
  startUpload: number;
  req: ApiRequest;
  rows1: AnyObj[];
  rows2: AnyObj[];
  totalErrors;
  hasTotalErrors: boolean;
  hasTwoSheets: boolean;
  uploadName: string;
  userId: string;
  errors: object[];
  rowNum: number;
  fiscalMonth: number;
  fiscalYear: number;
  temp;
  submeasure;
  PropNames;
  sheet1SubmeasureNames;
  startedSheet2;
  user: DfaUser;
  moduleId: number;
  dfa: ApiDfaData;

  constructor(
    protected repo: RepoBase,
    protected openPeriodRepo: OpenPeriodRepo,
    protected submeasureRepo: SubmeasureRepo
    ) {
  }

// what this needs from sm approve for dept upload:
  /*
  req.query.moduleId // add in ui then or add in api from body?
    uploadType, can just put that in req.query too and look for it in the getUploadType function
    then done really, if you can handle req, res, next?? can't though?? I..e need to return sm from approve?
    and what does upload return?? probably upload record count and failures. Hmmm. how to mix the two return types??
    have to break out upload to 2 functions and use inner return value in approve without res.json call right?
   */

  upload(req, res, next) {
    this.verifyProperties(req.query, ['moduleId']);
    this.req = req;
    this.dfa = req.dfa;
    this.moduleId = Number(req.query.moduleId);
    this.user = req.user;
    this.setUploadType();
    this.startUpload = Date.now();
    this.userId = req.user.id;
    const sheets = xlsx.parse(req.file.buffer);
    let headerRow = sheets[0].data[4];
    this.rows1 = sheets[0].data.slice(5).filter(row => row.length > 0);
    this.rows2 = [];
    if (this.hasTwoSheets) {
      if (!sheets[1]) {
        next(new ApiError('Upload expects 2 sheets in upload file.', null, 400));
        return;
      }
      this.rows2 = sheets[1].data.slice(5).filter(row => row.length > 0);
    }
    this.totalErrors = {};
    this.hasTotalErrors = false;
    if (this.rows1.length === 0) {
      next(new ApiError('No records to upload. Please use the appropriate upload template, entering records after line 5.', null, 400));
      return;
    }
    const propNames = _.values(this.PropNames).map(x => x.trim().toLowerCase());
    headerRow = _.map(headerRow, (str) => str.replace(/(\*)/g, '').replace(/(\-)/g, ' ').trim().toLowerCase());
    if (headerRow.length !== _.intersection(headerRow, propNames).length) {
      next(new ApiError('Wrong template uploaded. Please use the appropriate upload template.', null, 400));
      return;
    }

    this.getInitialData()
      .then(() => this.removeOtherFiscalMonthOrFiscalYearUploads())
      .then(() => this.getValidationAndImportData())
      .then(() => this.validateRows(1, this.rows1))
      .then(() => this.lookForTotalErrors())
      .then(() => this.validateRows(2, this.rows2))
      .then(() => this.lookForTotalErrors())
      .then(() => this.validateOther())
      .then(() => this.lookForTotalErrors())
      .then(() => this.importRows(this.userId))
      //.then(() => this.sendSuccessEmail())
      .then(() => {
        return this.autoSync(req)
          .then(() => {
            if (!res.headersSent) {
              this.sendSuccessEmail();
              res.json({status: 'success', uploadName: this.uploadName, rowCount: this.rows1.length});
            }
          })
          .catch(err => {
            this.sendSuccessSyncEmail();
            res.json({status: 'successsync', uploadName: this.uploadName, rowCount: this.rows1.length});
            //throw new ApiError(`Upload succeeded, however data will be available in reports once allocation run or data loads complete.`, err);
          });
      })
      .catch(err => {
        if (err && err.name === this.UploadValidationError) {
          this.sendValidationEmail();
          if (!res.headersSent) {
            res.json({status: 'failure', uploadName: this.uploadName});
          }
        } else {
          const data = Object.assign({}, err);
          if (err.message) {
            data.message = err.message;
          }
          if (err.stack) {
            data.stack = err.stack;
          }
          const _err = new ApiError(`Unexpected ${this.uploadName} Error.`, data);
          this.sendErrorEmail(_err);
          next(_err);
        }
      });
  }

  getInitialData(): Promise<any> {
    return Promise.all([
      this.openPeriodRepo.getOneByQuery({moduleId: this.moduleId}),
      this.submeasureRepo.getManyLatestGroupByNameActive(this.moduleId)
    ])
      .then(results => {
        this.fiscalMonth = results[0].fiscalMonth;
        this.fiscalYear = shUtil.fiscalYearFromFiscalMonth(this.fiscalMonth)
        this.data.submeasures = results[1];
      });
  }

  removeOtherFiscalMonthOrFiscalYearUploads() {
    if (this.repo.hasFiscalMonth()) {
      return this.repo.removeMany({fiscalMonth: {$ne: this.fiscalMonth}});
    } else if (this.repo.hasFiscalYear()) {
      return this.repo.removeMany({fiscalYear: {$ne: this.fiscalYear}});
    } else {
      return Promise.resolve();
    }
  }

  getValidationAndImportData() {
    return Promise.resolve();
  }

  removeDuplicatesFromDatabase(imports: AnyObj[]): Promise<any> {
    return Promise.reject(new ApiError('removeDuplicatesFromDatabase not implemented.'));
  }

  removeSubmeasureNameDuplicatesFromDatabase(imports: AnyObj[]) {
    const submeasureNames = _.uniq(imports.map(imp => imp.submeasureName));
    return this.repo.removeMany({submeasureName: {$in: submeasureNames}});
  }

  importRows(userId) {
    return this.getImportArray()
      .then(imports => {
        return this.removeDuplicatesFromDatabase(imports)
          .then(() => imports);
      })
      .then(imports => this.repo.addManyTransaction(imports, userId));
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
      });
  }

  // this is different from rows, rows will title per row with an error array: {error} or {property, error, value?}
  // this will title via error message and display (error} or {property, error, value?} from error array
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
      });
  }

  // message is only used by validateOther where it's used to title the error list
  // validateRows will add "Row X" instead
  // this is our break out of the validateRow promise chain, call this to get out if no reason to continue
  // say no submeasure, then can't continue submeasure based validations
  lookForErrors(message = '') {
    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, message, _.sortBy(this.errors, 'property')));
    }
    return Promise.resolve();
  }

  // this is out break out of upload promise chain. If we have errors in sheet1, this could mess
  // up later validation in sheet2 or validate, so we break out
  lookForTotalErrors() {
    if (this.hasTotalErrors) {
      return Promise.reject(new NamedApiError(this.UploadValidationError));
    }
    return Promise.resolve();
  }

  sendEmail(subject, body) {
    return mail.sendHtmlMail(
      this.dfa.dfaAdminEmail,
      svrUtil.getEnvEmail(this.req.user.email),
      null,
      subject,
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
  sendSuccessSyncEmail(){
    this.sendEmail(`${this.uploadName} - Success`, this.buildSuccessEmailBodySync());
  }

  buildSuccessEmailBodySync() {
    return `<div>${this.rows1.length} rows have been processed, however data will be available in reports once allocation run or data loads complete.</div>`
  }

  buildSuccessEmailBody() {
    return `<div>${this.rows1.length} rows successfully processed.</div>`
  }

  buildErrorEmailBody(err) {
    const body = svrUtil.isProdEnv() ? `<div>${err.message}</div>` :
    `<div>${err.message}</div>
    <pre>
      ${JSON.stringify(err.data, null, 2)}
    </pre>`;
    return body;
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
            append += `<td style="width: 300px;">${err.value}</td>`;
          }
          append += '</tr>';
          body += append;
        } else {
          body += `<tr><td colspan="2" style="width:630px">* ${err.error}</td></tr>`;
        }
      })
      body += '</table>';
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

  addError(property, message, value?) {
    const obj: {property: string, error: string, value?} = {property, error: message};
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

  addErrorInvalid(property, value, acceptableValues?) {
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

  validateNumberValue(prop, val, required) {
    if (required && (val === undefined || val === '')) {
      this.addErrorRequired(prop);
      return false;
    } else if (Number.isNaN(Number(val))) {
      this.addError(prop, 'Not a number', val);
      return false;
    }
    return true;
  }

  validatePercentageValue(prop, val, required) {
    if (!this.validateNumberValue(prop, val, required)) {
      return false;
    } else if (!(Number(val) >= 0.0 && Number(val) <= 1.0)) {
      this.addError(prop, 'Not a valid percentage, should be >= 0 and <= 1', val);
      return false;
    }
    return true;
  }

  getSubmeasure() {
    this.submeasure = _.find(this.data.submeasures, sm => sm.name.toUpperCase() === (this.temp.submeasureName && this.temp.submeasureName.toUpperCase()));
    return Promise.resolve();
  }

  validateSubmeasure() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(this.PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(this.PropNames.submeasureName, 'No Sub Measure exists by this name', this.temp.submeasureName);
    } else if (this.submeasure.indicators.groupFlag === 'Y' && this.submeasure.indicators.allocationRequired === 'N') {
      this.addError(this.PropNames.submeasureName, 'Submeasure is a grouping submeasure without Allocation Required', this.temp.submeasureName);
    }
    return Promise.resolve();
  }

  validateMeasureAccess() {
    // todo: need a measureId to measureRole map (from ART data) to determine measure role here
    if (!this.user.isAuthorized('super-user')) {
      this.addError('', `Not authorized for this measure: ${this.submeasure.measureId}.`);
    }
    return Promise.resolve();
  }

  validateProperty(temp, prop, values, required?) {
    if (required && !this.temp[prop]) {
      this.addErrorRequired(this.PropNames[prop]);
    } else if (this.temp[prop] !== undefined && this.notExists(values, this.temp[prop])) {
      this.addErrorInvalid(this.PropNames[prop], this.temp[prop]);
    }
    return Promise.resolve();
  }

  validate(): Promise<any> {
    return Promise.resolve();
  }

  getImportArray(): Promise<any> {
    return Promise.resolve();
  }

  validateTest() {
    if (true) {
      this.addErrorMessageOnly(`Sub Measure doesn't allow department upload`);
      this.addError('Some Prop', `Sub Measure doesn't allow department upload`);
      this.addError('Some Prop', `Sub Measure doesn't allow department upload`, 'Some val');
    }
    return Promise.resolve();
  }

  setUploadType() {
    const uploadType = this.req.path.substr(this.req.path.lastIndexOf('/') + 1);
    if (uploadType.length < 3) {
      throw new ApiError(`no uploadType: ${uploadType}.`);
    }
  }

  getSyncMapFromUploadType() {
    const uploadTypes = {
      prof: [
        {type: 'dollar-upload', syncMapProp: 'dfa_prof_input_amnt_upld'},
        {type: 'mapping-upload', syncMapProp: 'dfa_prof_manual_map_upld'},
        {type: 'dept-upload', syncMapProp: 'dfa_prof_dept_acct_map_upld'},
        {type: 'sales-split-upload', syncMapProp: 'dfa_prof_sales_split_pctmap_upld'},
        {type: 'product-class-upload', syncMapProp: 'dfa_prof_swalloc_manualmix_upld'},
        {type: 'alternate-sl2-upload', syncMapProp: 'dfa_prof_scms_triang_altsl2_map_upld'},
        {type: 'corp-adjustments-upload', syncMapProp: 'dfa_prof_scms_triang_corpadj_map_upld'},
        {type: 'disti-direct-upload', syncMapProp: 'dfa_prof_disti_to_direct_map_upld'},
        {type: 'service-map-upload', syncMapProp: 'dfa_prof_service_map_upld'},
        {type: 'service-training-upload', syncMapProp: 'dfa_prof_service_trngsplit_pctmap_upld'},
      ]
    };
    const syncMap = new SyncMap();
    const syncProp = _.find(uploadTypes[this.req.dfa.module.abbrev], {type: this.req.query.uploadType}).syncMapProp;
    if (!syncProp) {
      throw new ApiError(`getSyncMapFromUploadType: no syncProp.`);
    }
    syncMap[syncProp] = true;
    return syncMap;
  }

  autoSync(req) {
    return Promise.resolve();
  }

  verifyProperties(data, arr) {
    const missingProps = [];
    arr.forEach(prop => {
      if (!data[prop]) {
        missingProps.push(prop);
      }
    });
    if (missingProps.length) {
      throw new ApiError(`Properties missing: ${missingProps.join(', ')}.`, data, 400);
    }
  }

}


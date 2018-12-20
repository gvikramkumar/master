import xlsx from 'node-xlsx';
import {NamedApiError} from '../common/named-api-error';
import {ApiError} from '../common/api-error';
import _ from 'lodash';
import {sendHtmlMail} from '../common/mail';
import SubmeasureRepo from '../../api/common/submeasure/repo';
import RepoBase from './repo-base';
import ApiRequest from '../models/api-request';
import AnyObj from '../../../shared/models/any-obj';
import OpenPeriodRepo from '../../api/common/open-period/repo';
import DfaUser from '../../../shared/models/dfa-user';
import {svrUtil} from '../common/svr-util';
import {ApiDfaData} from '../middleware/add-global-data';
import {SyncMap} from '../../../shared/models/sync-map';
import DatabaseController from '../../api/database/controller';
import config from '../../config/get-config';
import {injector} from '../common/inversify.config';


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

  upload(req, res, next) {
    this.verifyProperties(req.query, ['moduleId']);
    this.dfa = req.dfa;
    this.moduleId = Number(req.query.moduleId);
    this.user = req.user;
    this.uploadType = this.getUploadType(req);
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

    this.getInitialData()
      .then(() => this.removeOtherFiscalMonthUploads())
      .then(() => this.getValidationAndImportData())
      .then(() => this.validateRows(1, this.rows1))
      .then(() => this.lookForTotalErrors())
      .then(() => this.validateRows(2, this.rows2))
      .then(() => this.lookForTotalErrors())
      .then(() => this.validateOther())
      .then(() => this.lookForTotalErrors())
      .then(() => this.importRows(req.user.id))
      .then(() => this.autoSyncOnStaging(req, res, next))
      .then(() => {
        this.sendSuccessEmail();
        res.json({status: 'success', uploadName: this.uploadName, rowCount: this.rows1.length});
      })
      .catch(err => {
        if (err && err.name === this.UploadValidationError) {
          this.sendValidationEmail();
          res.json({status: 'failure', uploadName: this.uploadName});
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

  getInitialData(): Promise<any> {
    return Promise.all([
      this.openPeriodRepo.getOneByQuery({moduleId: this.moduleId}),
      this.submeasureRepo.getManyLatestGroupByNameActive(this.moduleId)
    ])
      .then(results => {
        this.fiscalMonth = results[0].fiscalMonth;
        this.data.submeasures = results[1];
      });
  }

  removeOtherFiscalMonthUploads() {
    if (this.repo.hasFiscalMonth()) {
      return this.repo.removeMany({fiscalMonth: {$ne: this.fiscalMonth}});
    } else {
      return Promise.resolve();
    }
  }

  getValidationAndImportData() {
    return Promise.resolve();
  }

  removeDuplicatesFromDatabase(imports: AnyObj[]): Promise<any> {
    return Promise.reject(new ApiError('removeDuplicatesFromDatabase not implemented'));
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
  lookForErrors(message?) {
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
    return sendHtmlMail(
      svrUtil.getItadminEmail(this.dfa),
      this.req.user.email,
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

  buildSuccessEmailBody() {
    return `<div>${this.rows1.length} rows successfully processed.</div>`
  }

  buildErrorEmailBody(err) {
    return `
    <div>${err.message}</div>
    <pre>
      ${JSON.stringify(err.data, null, 2)}
    </pre>`;
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
    } else if (!(Number(val) <= 1.0)) {
      this.addError(prop, 'Not a valid percentage, should be <= 1', val);
      return false;
    }
    return true;
  }

  getSubmeasure() {
    this.submeasure = _.find(this.data.submeasures, {name: this.temp.submeasureName});
    return Promise.resolve();
  }

  validateSubmeasure() {
    if (!this.temp.submeasureName) {
      this.addErrorRequired(this.PropNames.submeasureName);
    } else if (!this.submeasure) {
      this.addError(this.PropNames.submeasureName, 'No Sub Measure exists by this name', this.temp.submeasureName);
    } else if (this.submeasure.indicators.groupFlag === 'Y') {
      this.addError(this.PropNames.submeasureName, 'Submeasure is a grouping submeasure', this.temp.submeasureName);
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

  getUploadType(req) {
    const uploadType = req.path.substr(req.path.lastIndexOf('/') + 1);
    if (uploadType.length < 3) {
      throw new ApiError(`autoSyncOnStaging: no uploadType: ${uploadType}`);
    }
    return uploadType;
  }

  getSyncMapFromUploadType(req) {
    const uploadTypes = {
      prof: [
        {type: 'dollar-upload', syncMapProp: 'dfa_prof_input_amnt_upld'},
        {type: 'mapping-upload', syncMapProp: 'dfa_prof_manual_map_upld'},
        {type: 'dept-upload', syncMapProp: 'dfa_prof_dept_acct_map_upld'},
        {type: 'sales-split-upload', syncMapProp: 'dfa_prof_sales_split_pctmap_upld'},
        {type: 'product-class-upload', syncMapProp: 'dfa_prof_swalloc_manualmix_upld'},
        {type: 'alternate-sl2-upload', syncMapProp: 'dfa_prof_scms_triang_altsl2_map_upld'},
        {type: 'corp-adjustments-upload', syncMapProp: 'dfa_prof_scms_triang_corpadj_map_upld'},
      ]
    };
    const syncMap = new SyncMap();
    const syncProp = _.find(uploadTypes[req.dfa.module.abbrev], {type: this.uploadType}).syncMapProp;
    if (!syncProp) {
      throw new ApiError(`getSyncMapFromUploadType: no syncProp`);
    }
    syncMap[syncProp] = true;
    return syncMap;
  }

  autoSyncOnStaging(req, res, next): Promise<any> {
    if (config.autoSyncOn) {
      const syncMap = this.getSyncMapFromUploadType(req);
      const databaseCtrl = injector.get(DatabaseController);
      return databaseCtrl.mongoToPgSyncPromise(req.dfa, syncMap, req.user.id)
        .catch(err => {
          throw new ApiError('AutoSync error', err);
        });
    } else {
      return Promise.resolve();
    }

  }

  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400);
      }
    });
  }

}


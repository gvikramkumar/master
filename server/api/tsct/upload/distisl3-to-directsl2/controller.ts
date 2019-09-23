import {injectable} from 'inversify';
import _ from 'lodash';
import UploadController from '../../../../lib/base-classes/upload-controller';
import Distisl3ToDirectsl2UploadRepo from '../../distisl3-to-directsl2-upload/repo';
import Distisl3ToDirectsl2UploadTemplate from './template';
import Distisl3ToDirectsl2UploadImport from './import';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import AnyObj from '../../../../../shared/models/any-obj';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import {svrUtil} from '../../../../lib/common/svr-util';
import DatabaseController from '../../../database/controller';
import { SyncMap } from '../../../../../shared/models/sync-map';
@injectable()
export default class Distisl3ToDirectsl2UploadUploadController extends UploadController {
  imports: AnyObj[];

  constructor(
    repo: Distisl3ToDirectsl2UploadRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    private databaseController: DatabaseController
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Disty SL3 to Direct SL2 Mapping';

    this.PropNames = {
      driverSl2: 'Driver SL2',
      sourceSl2: 'Source SL3',
      externalTheater: 'External Theater'
    }
  }

  validateRow1(row) {
    this.temp = new Distisl3ToDirectsl2UploadTemplate(row);
    return this.getSubmeasure()
      .then(() => this.validateSubmeasure())
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        // this.validateMeasureAccess(),
        this.validateCanProductClassUpload(),
      ]))
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        this.validateSplitCategory(),
        this.validateSplitPercentage(),
      ]))
      .then(() => this.lookForErrors());
  }

  validate() {
    // sort by submeasureName, add up splitPercentage, error if not 1.0
    this.imports =
      _.sortBy(this.rows1.map(row => new Distisl3ToDirectsl2UploadImport(row, this.fiscalMonth)), 'submeasureName');

    let obj = {};
    this.imports.forEach(val => {
      if (!obj[val.submeasureName]) {
        obj[val.submeasureName] = {hw: 0, sw: 0};
      }
      if (val.splitCategory === 'HARDWARE') {
        obj[val.submeasureName].hw++;
      } else if (val.splitCategory === 'SOFTWARE') {
        obj[val.submeasureName].sw++;
      }
    });
    _.forEach(obj, (val, key) => {
      if (val.hw > 1 || val.sw > 1) {
        this.addErrorMessageOnly(key);
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Submeasures with duplicate HW/SW entries', this.errors));
    }

    obj = {};
    this.imports.forEach(val => {
      if (obj[val.submeasureName]) {
        obj[val.submeasureName] += val.splitPercentage;
      } else {
        obj[val.submeasureName] = val.splitPercentage;
      }
    });
    _.forEach(obj, (val, key) => {
      if (svrUtil.toFixed8(val) !== 1.0) {
        this.addError(key, val); // resuse (prop, error) error list for (submeasureName, total)
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Submeasure percentage values not 100%', this.errors));
    }

    return Promise.resolve();
  }

  getImportArray() {
    // we already put the imports together in validate() so just use them
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports) {
    return this.removeSubmeasureNameDuplicatesFromDatabase(imports);
  }

  validateCanProductClassUpload() {
    if (this.submeasure.categoryType !== 'Manual Mix') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow product classification upload`);
    }
    return Promise.resolve();
  }

  validateSplitCategory() {
    if (!this.temp.splitCategory) {
      this.addErrorRequired(this.PropNames.splitCategory);
    } else if (!_.includes(['HARDWARE', 'SOFTWARE'], this.temp.splitCategory.toUpperCase())) {
      this.addErrorInvalid(this.PropNames.splitCategory, this.temp.splitCategory, 'HARDWARE/SOFTWARE');
    }
    return Promise.resolve();
  }

  validateSplitPercentage() {
    if (this.validatePercentageValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
    }
    return Promise.resolve();
  }
  autoSync(req) {
    return this.getImportArray()
      .then(imports => {
        const syncMap = new SyncMap();
        const data = {syncMap};
        return this.databaseController.mongoToPgSyncPromise(req.dfa, data, req.user.id);
      });
  }
}


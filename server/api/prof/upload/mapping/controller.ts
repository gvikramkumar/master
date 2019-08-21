import {injectable} from 'inversify';
import InputFilterLevelUploadController from '../../../../lib/base-classes/input-filter-level-upload-controller';
import MappingUploadRepo from '../../mapping-upload/repo';
import MappingUploadTemplate from './template';
import MappingUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import AnyObj from '../../../../../shared/models/any-obj';
import {NamedApiError} from '../../../../lib/common/named-api-error';
import _ from 'lodash';
import {svrUtil} from '../../../../lib/common/svr-util';
import DatabaseController from '../../../database/controller';
import { SyncMap } from '../../../../../shared/models/sync-map';
@injectable()
export default class MappingUploadUploadController extends InputFilterLevelUploadController {
  imports: AnyObj[];

  constructor(
    repo: MappingUploadRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    private databaseController: DatabaseController
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Mapping Upload';

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      inputProductValue: 'Input Product Value',
      inputSalesValue: 'Input Sales Value',
      inputLegalEntityValue: 'Input Legal Entity Value',
      inputBusinessEntityValue: 'Input Business Entity Value',
      scmsSegment: 'SCMS Segment',
      percentage: 'Percentage Value'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData()
    ]);
  }

  validateRow1(row) {
    this.temp = new MappingUploadTemplate(row);
    return this.getSubmeasure()
      .then(() => this.validateSubmeasure())
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        // this.validateMeasureAccess(),
        this.validateCanMappingUpload(),
      ]))
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        this.validateInputProductValue(),
        this.validateInputSalesValue(),
        this.validateInputLegalEntityValue(),
        this.validateInputBusinessEntityValue(),
        this.validateSCMSSegment(),
        this.validatePercentage(),
      ]))
      .then(() => this.lookForErrors());
  }

  validate() {
    // sort by submeasureName, add up splitPercentage, error if not 1.0
    this.imports =
      _.sortBy(this.rows1.map(row => new MappingUploadImport(row, this.fiscalMonth)), 'submeasureName');
    const obj = {};
    this.imports.forEach(val => {
      if (obj[val.submeasureName]) {
        obj[val.submeasureName] = obj[val.submeasureName] + val.percentage;
      } else {
        obj[val.submeasureName] = val.percentage;
      }
    });

    _.forEach(obj, (val, key) => {
      if (svrUtil.toFixed8(val) !== 1.0) {
        this.addError(key, svrUtil.toFixed8(val)); // resuse (prop, error) error list for (submeasureName, total)
      }
    });

    if (this.errors.length) {
      return Promise.reject(new NamedApiError(this.UploadValidationError, 'Submeasure percentage values not 100%', this.errors));
    }
    return Promise.resolve();
  }

  getImportArray() {
    return Promise.resolve(this.imports);
  }

  removeDuplicatesFromDatabase(imports) {
    return this.removeSubmeasureNameDuplicatesFromDatabase(imports);
  }

  validateCanMappingUpload() {
    if (this.submeasure.indicators.manualMapping.toUpperCase() !== 'Y') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow mapping upload`);
    }
    return Promise.resolve();
  }

  validatePercentage() {
    if (this.validatePercentageValue(this.PropNames.percentage, this.temp.percentage, true)) {
      this.temp.percentage = Number(this.temp.percentage);
    }
    return Promise.resolve();
  }

  validateRevenueClassification() {
    if (this.temp.revenueClassification &&
      this.notExists(this.data.revClassifications, this.temp.revenueClassification)) {
      this.addErrorInvalid(this.PropNames.revenueClassification, this.temp.revenueClassification);
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


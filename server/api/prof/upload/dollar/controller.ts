import {injectable} from 'inversify';
import DollarUploadRepo from '../../dollar-upload/repo';
import _ from 'lodash';
import InputFilterLevelUploadController from '../../../../lib/base-classes/input-filter-level-upload-controller';
import DollarUploadTemplate from './template';
import DollarUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import SourceRepo from '../../../common/source/repo';
import {Source} from '../../../../../shared/models/source';
import {ApiError} from '../../../../lib/common/api-error';
import OpenPeriodRepo from '../../../common/open-period/repo';
import AnyObj from '../../../../../shared/models/any-obj';
import PgLookupRepo from '../../../pg-lookup/repo';
import DatabaseController from '../../../database/controller';
import {SyncMap} from '../../../../../shared/models/sync-map';


@injectable()
export default class DollarUploadUploadController extends InputFilterLevelUploadController {

  constructor(
    repo: DollarUploadRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    private sourceRepo: SourceRepo,
    private pgLookupRepo: PgLookupRepo,
    private databaseController: DatabaseController
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Dollar Upload';

    this.PropNames = {
      submeasureName: 'Sub Measure Name',
      inputProductValue: 'Input Product Value',
      inputSalesValue: 'Input Sales Value',
      grossUnbilledAccruedRevenueFlag: 'Gross Unbilled Accrued Revenue Flag',
      inputLegalEntityValue: 'Input Legal Entity Value',
      inputBusinessEntityValue: 'Input Business Entity Value',
      scmsSegment: 'SCMS Segment',
      amount: 'Amount',
      dealId: 'Deal ID',
      revenueClassification: 'Revenue Classification'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData(),
      this.pgLookupRepo.getDealIdSortedUpper(this.req.dfa.fiscalMonths.prof),
    ])
      .then(results => {
        this.data.dealIds = results[1];
      });
  }

  validateRow1(row) {
    this.temp = new DollarUploadTemplate(row);
    return this.getSubmeasure()
      .then(() => this.validateSubmeasure())
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        // this.validateMeasureAccess(),
        this.validateSubmeasureCanManualUpload(),
        this.validateCanDollarUpload(),
      ]))
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        this.validateInputProductValue(true),
        this.validateInputSalesValue(true),
        this.validateGrossUnbilledAccruedRevenueFlag(),
        this.validateInputLegalEntityValue(true),
        this.validateInputBusinessEntityValue(true),
        this.validateSCMSSegment(true),
        this.validateAmount(),
        this.validateDealId(),
        this.validateRevenueClassification(),
      ]))
      .then(() => this.lookForErrors());
  }

  validate() {
    return Promise.resolve();
  }

  // put together imports for use in UpdateController.importRows
  getImportArray() {
    const imports = this.rows1.map(row => new DollarUploadImport(row, this.fiscalMonth));
    return Promise.resolve(imports);
  }

  removeDuplicatesFromDatabase(imports) {
    return this.removeSubmeasureNameDuplicatesFromDatabase(imports);
  }

  validateSubmeasureCanManualUpload() {
    if (this.submeasure.sourceId !== 4) {// manual upload source
      this.addErrorMessageOnly(`Sub Measure doesn't allow manual upload`);
    }
    return Promise.resolve();
  }

  validateCanDollarUpload() {
    if (this.submeasure.indicators.dollarUploadFlag.toUpperCase() !== 'Y') {
      this.addErrorMessageOnly(`Sub Measure doesn't allow dollar upload`);
    }
    return Promise.resolve();
  }

  validateGrossUnbilledAccruedRevenueFlag() {
    if (!_.includes([undefined, 'Y', 'N'], this.temp.grossUnbilledAccruedRevenueFlag)) {
      this.addErrorInvalid(this.PropNames.grossUnbilledAccruedRevenueFlag,
        this.temp.grossUnbilledAccruedRevenueFlag, 'Y/N/NULL');
    }
    return Promise.resolve();
  }

  validateAmount() {
    if (this.validateNumberValue(this.PropNames.amount, this.temp.amount, true)) {
      this.temp.amount = Number(this.temp.amount);
    }
    return Promise.resolve();
  }

  validateDealId() {
    if (this.temp.dealId &&
      this.notExists(this.data.dealIds, this.temp.dealId)) {
      this.addErrorInvalid(this.PropNames.dealId, this.temp.dealId);
    }
    return Promise.resolve();
  }

  validateRevenueClassification() {
    const vals = ['Non Recurring', 'Recurring Deferred', 'Recurring Non Deferred', 'Recurring Other'].map(x => x.toUpperCase());
    if (this.temp.revenueClassification && this.notExists(vals, this.temp.revenueClassification)) {
      this.addErrorInvalid(this.PropNames.revenueClassification, this.temp.revenueClassification);
    }
    return Promise.resolve();
  }

  autoSync(req) {
    return this.getImportArray()
      .then(imports => {
        const submeasureNames = _.uniq(imports.map(x => x.submeasureName));
        const syncMap = new SyncMap().setSyncTableList('dfa_prof_input_amnt_upld_autosync');
        const data = {syncMap, submeasureNames};
        return this.databaseController.mongoToPgSyncPromise(req.dfa, data, req.user.id);
      });
  }

}


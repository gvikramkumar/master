import {injectable} from 'inversify';
import DollarUploadRepo from '../../dollar-upload/repo';
import * as _ from 'lodash';
import InputFilterLevelUploadController from '../../../../lib/base-classes/input-filter-level-upload-controller';
import DollarUploadTemplate from './template';
import DollarUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import UserRoleRepo from '../../../../lib/database/repos/user-role-repo';
import SourceRepo from '../../../common/source/repo';
import {Source} from '../../../../../shared/models/source';
import {ApiError} from '../../../../lib/common/api-error';
import OpenPeriodRepo from '../../../common/open-period/repo';


@injectable()
export default class DollarUploadUploadController extends InputFilterLevelUploadController {
  sources: Source[];

  constructor(
    repo: DollarUploadRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    userRoleRepo: UserRoleRepo,
    private sourceRepo: SourceRepo
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo,
      userRoleRepo
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
    }
  }

  getValidationAndImportData() {
    return Promise.all([
      super.getValidationAndImportData(),
      this.sourceRepo.getMany()
    ])
      .then(results => {
        this.sources = results[1];
      });
  }

  validateRow1(row) {
    this.temp = new DollarUploadTemplate(row);
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
    ])
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        // this.validateMeasureAccess(),
        this.validateSubmeasureCanManualUpload(),
        this.validateCanDollarUpload(),
      ]))
      .then(() => this.lookForErrors())
      .then(() => Promise.all([
        this.validateInputProductValue(),
        this.validateInputSalesValue(),
        this.validateGrossUnbilledAccruedRevenueFlag(),
        this.validateInputLegalEntityValue(),
        this.validateInputBusinessEntityValue(),
        this.validateSCMSSegment(),
        this.validateAmount(),
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

  validateSubmeasureCanManualUpload() {
    const source = _.find(this.sources, {typeCode: 'EXCEL'}); // manual upload source
    if (!source || this.submeasure.sourceId !== source.sourceId) {
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

  validateRevenueClassification() {
    if (this.temp.revenueClassification &&
      this.notExists(this.data.revClassifications, this.temp.revenueClassification)) {
      this.addErrorInvalid(this.PropNames.revenueClassification, this.temp.revenueClassification);
    }
    return Promise.resolve();
  }

}


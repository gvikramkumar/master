import {injectable} from 'inversify';
import InputFilterLevelUploadController from '../../../../lib/base-classes/input-filter-level-upload-controller';
import MappingUploadRepo from '../../mapping-upload/repo';
import MappingUploadTemplate from './template';
import MappingUploadImport from './import';
import {Modules} from '../../../../../shared/enums';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import UserRoleRepo from '../../../../lib/database/repos/user-role-repo';

@injectable()
export default class MappingUploadUploadController extends InputFilterLevelUploadController {

  constructor(
    repo: MappingUploadRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo,
    userRoleRepo: UserRoleRepo
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo,
      userRoleRepo
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
    return Promise.all([
      this.getSubmeasure(),
      this.validateSubmeasureName(),
      this.lookForErrors()
    ])
      .then(() => Promise.all([
        this.validateMeasureAccess(),
        this.validateCanMappingUpload(),
        this.lookForErrors()
      ]))
      .then(() => Promise.all([
        this.validateInputProductValue(),
        this.validateInputSalesValue(),
        this.validateInputLegalEntityValue(),
        this.validateInputBusinessEntityValue(),
        this.validateSCMSSegment(),
        this.validatePercentage(),
        this.lookForErrors()
      ]));
  }

  validate() {
    return Promise.resolve();
  }

  getImportArray() {
    const imports = this.rows1.map(row => new MappingUploadImport(row, this.fiscalMonth));
    return Promise.resolve(imports);
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

}


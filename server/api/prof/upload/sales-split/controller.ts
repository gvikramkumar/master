import {injectable} from 'inversify';
import UploadController from '../../../../lib/base-classes/upload-controller';
import SalesSplitUploadRepo from '../../sales-split-upload/repo';
import PgLookupRepo from '../../../pg-lookup/repo';
import SalesSplitUploadTemplate from './template';
import _ from 'lodash';
import SalesSplitUploadImport from './import';
import SubmeasureRepo from '../../../common/submeasure/repo';
import OpenPeriodRepo from '../../../common/open-period/repo';
import DollarUploadImport from '../dollar/import';
import DeptUploadImport from '../dept/import';
import AnyObj from '../../../../../shared/models/any-obj';
import {svrUtil} from '../../../../lib/common/svr-util';

@injectable()
export default class SalesSplitUploadUploadController extends UploadController {
  imports: AnyObj[];

  constructor(
    repo: SalesSplitUploadRepo,
    private pgRepo: PgLookupRepo,
    openPeriodRepo: OpenPeriodRepo,
    submeasureRepo: SubmeasureRepo
  ) {
    super(
      repo,
      openPeriodRepo,
      submeasureRepo
    );
    this.uploadName = 'Sales Level Split Upload';

    this.PropNames = {
      accountId: 'Account ID',
      companyCode: 'Company Code',
      subaccountCode: 'Sub Account Code',
      salesTerritoryCode: 'Sales Territory Code',
      splitPercentage: 'Percentage Value'
    };
  }

  getValidationAndImportData() {
    return Promise.all([
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_account_sub_account', 'bk_financial_account_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_financial_department', 'company_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_account_sub_account', 'bk_subaccount_code'),
      this.pgRepo.getSortedUpperListFromColumn('fpacon.vw_fpa_sales_hierarchy', 'sales_territory_name_code')
    ])
      .then(results => {
        this.data.accountIds = results[0];
        this.data.companyCodes = results[1];
        this.data.subaccountCodes = results[2];
        this.data.salesTerritoryCodes = results[3];
      });
  }

  validateRow1(row) {
    this.temp = new SalesSplitUploadTemplate(row);
    return Promise.all([
      this.validateAccountId(),
      this.validateCompanyCode(),
      this.validateSubaccountCode(),
      this.validateSalesTerritoryCode(),
      this.validateSplitPercentage(),
    ])
      .then(() => this.lookForErrors());
  }

  validate() {
    return this.verifyUniqueCombination()
      .then(() => this.lookForErrors(`${this.PropNames.accountId} / ${this.PropNames.companyCode} / ${this.PropNames.subaccountCode} / ${this.PropNames.salesTerritoryCode} having duplicate entries`))
      .then(() => this.accountId_companyCode_subaccountCode_addUpTo1())
      .then(() => this.lookForErrors(`${this.PropNames.accountId} / ${this.PropNames.companyCode} / ${this.PropNames.subaccountCode} totals not adding up to 1`));
  }

  verifyUniqueCombination() {
    const temps = this.rows1.map(row => new SalesSplitUploadTemplate(row));
    const results = {};
    temps.forEach(temp => {
      const val = _.get(results, `${temp.accountId}.${temp.companyCode}.${temp.subaccountCode}.${temp.salesTerritoryCode}.count`) || 0;
      _.set(results, `${temp.accountId}.${temp.companyCode}.${temp.subaccountCode}.${temp.salesTerritoryCode}.count`, val + 1);
    })

    Object.keys(results).forEach(accountId => {
      Object.keys(results[accountId]).forEach(companyCode => {
        Object.keys(results[accountId][companyCode]).forEach(subaccountCode => {
          Object.keys(results[accountId][companyCode][subaccountCode]).forEach(salesTerritoryCode => {
          if (results[accountId][companyCode][subaccountCode][salesTerritoryCode].count > 1) {
            this.addErrorMessageOnly(`${accountId} / ${companyCode} / ${subaccountCode} /  ${salesTerritoryCode}`);
          }
          });
        });
      });
    });
    return Promise.resolve();
  }

  accountId_companyCode_subaccountCode_addUpTo1() {
    const temps = this.rows1.map(row => new SalesSplitUploadTemplate(row));
    const results = {};
    temps.forEach(temp => {
      const val = _.get(results, `${temp.accountId}.${temp.companyCode}.${temp.subaccountCode}.total`) || 0.0;
      _.set(results, `${temp.accountId}.${temp.companyCode}.${temp.subaccountCode}.total`, val + temp.splitPercentage);
    })

    Object.keys(results).forEach(accountId => {
      Object.keys(results[accountId]).forEach(companyCode => {
        Object.keys(results[accountId][companyCode]).forEach(subaccountCode => {
          if (svrUtil.toFixed8(results[accountId][companyCode][subaccountCode].total) !== 1.0) {
            this.addErrorMessageOnly(`${accountId} / ${companyCode} / ${subaccountCode}`);
          }
        });
      });
    });
  }

  getImportArray() {
    const imports = this.rows1.map(row => new SalesSplitUploadImport(row, this.fiscalMonth));
    return Promise.resolve(imports);
  }

  removeDuplicatesFromDatabase(imports: SalesSplitUploadImport[]) {
    return this.repo.removeMany({});
  }

  validateAccountId() {
    if (!this.temp.accountId) {
      this.addErrorRequired(this.PropNames.accountId);
    } else if (this.notExists(this.data.accountIds, this.temp.accountId)) {
      this.addErrorInvalid(this.PropNames.accountId, this.temp.accountId);
    }
    return Promise.resolve();
  }

  validateCompanyCode() {
    if (!this.temp.companyCode) {
      this.addErrorRequired(this.PropNames.companyCode);
    } else if (this.notExists(this.data.companyCodes, this.temp.companyCode)) {
      this.addErrorInvalid(this.PropNames.companyCode, this.temp.companyCode);
    }
    return Promise.resolve();
  }

  validateSubaccountCode() {
    if (!this.temp.subaccountCode) {
      this.addErrorRequired(this.PropNames.subaccountCode);
    } else if (this.notExists(this.data.subaccountCodes, this.temp.subaccountCode)) {
      this.addErrorInvalid(this.PropNames.subaccountCode, this.temp.subaccountCode);
    }
    return Promise.resolve();
  }

  validateSalesTerritoryCode() {
    if (!this.temp.salesTerritoryCode) {
      this.addErrorRequired(this.PropNames.salesTerritoryCode);
    } else if (this.notExists(this.data.salesTerritoryCodes, this.temp.salesTerritoryCode)) {
      this.addErrorInvalid(this.PropNames.salesTerritoryCode, this.temp.salesTerritoryCode);
    }
    return Promise.resolve();
  }

  validateSplitPercentage() {
    if (this.validateNumberValue(this.PropNames.splitPercentage, this.temp.splitPercentage, true)) {
      this.temp.splitPercentage = Number(this.temp.splitPercentage);
    }
    return Promise.resolve();
  }

}


import {injectable} from 'inversify';
import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';
import DollarUploadImport from '../upload/dollar/import';
import AnyObj from '../../../../shared/models/any-obj';

export class DollarUploadPg {
  fiscalMonth: number;
  measureId: number;
  submeasureKey: number;
  productLevelId: string;
  productLevelName: string;
  productValue: string;
  salesLevelId: string;
  salesLevelName: string;
  salesValue: string;
  scmsLevelId: string;
  scmsLevelName: string;
  scmsValue: string;
  leLevelId: string;
  leLevelName: string;
  leValue: string;
  beLevelId: string;
  beLevelName: string;
  beValue: string;
  dealId: string;
  grossUnbilledAccruedFlag: string;
  revenueClassification: string;
  amount: number;
  createdBy: string;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;

  constructor(obj: AnyObj) {
    this.fiscalMonth = obj.fiscalMonth;
    this.productValue = obj.product;
    this.salesValue = obj.sales;
    this.scmsValue = obj.scms;
    this.leValue = obj.legalEntity;
    this.beValue = obj.intBusinessEntity;
    this.dealId = obj.dealId;
    this.grossUnbilledAccruedFlag = obj.grossUnbilledAccruedFlag;
    this.revenueClassification = obj.revenueClassification;
    this.amount = obj.amount;
    this.createdBy = obj.createdBy;
    this.createdDate = obj.createdDate;
    this.updatedBy = obj.updatedBy;
    this.updatedDate = obj.updatedDate;
  }
}

/*
CREATE TABLE fpadfa.dfa_prof_input_amnt_upld_o (
	fiscal_month_id numeric(22) NOT NULL,
	measure_id numeric(22) NOT NULL,
	sub_measure_key numeric(22) NOT NULL,
	deal_id varchar(100) NULL,
	gross_unbilled_accrued_rev_flg varchar(1) NULL,
	revenue_classification varchar(50) NULL,
	amount_value float8 NOT NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
)

 */


const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: '', type: OrmTypes.number},
  {prop: 'submeasureName', field: ''},
  {prop: 'product', field: ''},
  {prop: 'sales', field: ''},
  {prop: 'scms', field: ''},
  {prop: 'legalEntity', field: ''},
  {prop: 'intBusinessEntity', field: ''},
  {prop: 'dealId', field: ''},
  {prop: 'grossUnbilledAccruedFlag', field: ''},
  {prop: 'revenueClassification', field: ''},
  {prop: 'amount', field: '', type: OrmTypes.number},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export class DollarUploadPgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_prof_input_amnt_upld';

  constructor() {
    super(new Orm(ormMap));
  }

}


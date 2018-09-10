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

const ormMap: OrmMap[] = [
  {prop: 'fiscalMonth', field: 'fiscal_month_id', type: OrmTypes.number},
  {prop: 'measureId', field: 'measure_id', type: OrmTypes.number},
  {prop: 'submeasureKey', field: 'sub_measure_key', type: OrmTypes.number},
  {prop: 'productLevelId', field: 'input_product_hier_level_id', type: OrmTypes.number},
  {prop: 'productLevelName', field: 'input_product_hier_level_name'},
  {prop: 'productValue', field: 'input_product_value'},
  {prop: 'salesLevelId', field: 'input_sales_hier_level_id', type: OrmTypes.number},
  {prop: 'salesLevelName', field: 'input_sales_hier_level_name'},
  {prop: 'salesValue', field: 'input_sales_value'},
  {prop: 'scmsLevelId', field: 'input_scms_hier_level_id', type: OrmTypes.number},
  {prop: 'scmsLevelName', field: 'input_scms_hier_level_name'},
  {prop: 'scmsValue', field: 'input_scms_value'},
  {prop: 'leLevelId', field: 'input_entity_hier_level_id', type: OrmTypes.number},
  {prop: 'leLevelName', field: 'input_entity_hier_level_name'},
  {prop: 'leValue', field: 'input_entity_value'},
  {prop: 'beLevelId', field: 'input_internal_be_hier_level_id', type: OrmTypes.number},
  {prop: 'beLevelName', field: 'input_internal_be_hier_level_name'},
  {prop: 'beValue', field: 'input_internal_be_value'},
  {prop: 'dealId', field: 'deal_id'},
  {prop: 'grossUnbilledAccruedFlag', field: 'gross_unbilled_accrued_rev_flg'},
  {prop: 'revenueClassification', field: 'revenue_classification'},
  {prop: 'amount', field: 'amount_value', type: OrmTypes.number},
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


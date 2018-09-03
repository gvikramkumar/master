import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';
import {injectable} from 'inversify';

const ormMap: OrmMap[] = [
  {prop: 'submeasureId', field: 'sub_measure_id', type: OrmTypes.number},
  {prop: 'submeasureKey', field: 'sub_measure_key', type: OrmTypes.number},
  {prop: 'moduleId', field: 'module_id', type: OrmTypes.number},
  {prop: 'name', field: 'sub_measure_name'},
  {prop: 'desc', field: 'sub_measure_description'},
  {prop: 'sourceId', field: 'source_system_id', type: OrmTypes.number},
  {prop: 'measureId', field: 'measure_id', type: OrmTypes.number},
  {prop: 'startFiscalMonth', field: 'start_fiscal_period_id', type: OrmTypes.number},
  {prop: 'endFiscalMonth', field: 'end_fiscal_period_id', type: OrmTypes.number},
  {prop: 'processingTime', field: 'processing_frequency'},
  {prop: 'pnlnodeGrouping', field: 'pnlnode_grouping'},
  {prop: 'categoryType', field: 'category_type'},
  {prop: 'groupingSubmeasureId', field: 'grouped_by_smeasure_key', type: OrmTypes.number},
  {prop: 'sourceSystemAdjTypeId', field: 'source_system_adj_type_id', type: OrmTypes.number},
  {prop: 'glAcctNumber', field: 'gl_acct_number', type: OrmTypes.number},
  {prop: 'status', field: 'status_flag'},
  {prop: 'indicators.dollarUploadFlag', field: 'dollar_upld_flag'},
  {prop: 'indicators.approveFlag', field: 'approve_flag'},
  {prop: 'indicators.manualMapping', field: 'manual_mapping_flag'},
  {prop: 'indicators.expenseSSOT', field: '', mgDefault: 'N'},
  {prop: 'indicators.manualMix', field: '', mgDefault: 'N'},
  {prop: 'indicators.groupFlag', field: '', mgDefault: 'N'},
  {prop: 'indicators.retainedEarnings', field: 'retained_earnings_flag'},
  {prop: 'indicators.transition', field: 'transition_flag'},
  {prop: 'indicators.corpRevenue', field: 'corporate_revenue_flag'},
  {prop: 'indicators.dualGaap', field: 'dual_gaap_flag'},
  {prop: 'indicators.twoTier', field: 'twotier_flag'},
  {prop: 'indicators.service', field: 'service_flag'},
  {prop: 'indicators.deptAcct', field: 'dept_acct_flag'},
  {prop: 'reportingLevels[0]', field: 'gross_mgn_rollup1'},
  {prop: 'reportingLevels[1]', field: 'gross_mgn_rollup2'},
  {prop: 'reportingLevels[2]', field: 'gross_mgn_rollup3'},
  {prop: 'rules[0]', field: 'rule1'},
  {prop: 'rules[1]', field: 'rule2'},
  {prop: 'rules[2]', field: 'rule3'},
  {prop: 'rules[3]', field: 'rule4'},
  {prop: 'rules[4]', field: 'rule5'},
  {prop: 'createdBy', field: 'create_owner'},
  {prop: 'createdDate', field: 'create_datetimestamp', type: OrmTypes.date},
  {prop: 'updatedBy', field: 'update_owner'},
  {prop: 'updatedDate', field: 'update_datetimestamp', type: OrmTypes.date},
] ;

@injectable()
export default class SubmeasurePgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_sub_measure';
  idProp = 'submeasureId';

  constructor() {
    super(new Orm(ormMap));
  }
}

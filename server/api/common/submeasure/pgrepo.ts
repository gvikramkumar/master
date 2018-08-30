import {PgRepoBase} from '../../../lib/base-classes/pg-repo-base';
import {Orm, OrmMap, OrmTypes} from '../../../lib/base-classes/Orm';
import {injectable} from 'inversify';

/*
CREATE TABLE fpadfa.dfa_sub_measure (
	module_id numeric(10) NOT NULL,
	sub_measure_key float8 NOT NULL,
	sub_measure_id float8 NOT NULL,
	sub_measure_name varchar(70) NOT NULL,
	sub_measure_description varchar(250) NULL,
	category_type varchar(20) NULL,
	grouped_by_smeasure_key float8 NULL,
	measure_id float8 NOT NULL,
	source_system_id float8 NOT NULL,
	source_system_adj_type_id float8 NULL,
	start_fiscal_period_id float8 NULL,
	end_fiscal_period_id float8 NULL,
	processing_frequency varchar(15) NULL,
	pnlnode_grouping varchar(60) NULL,
	dollar_upld_flag bpchar(1) NULL,
	manual_mapping_flag bpchar(1) NULL,
	dept_acct_flag bpchar(1) NULL,
	approve_flag bpchar(1) NULL,
	change_approve_flag bpchar(1) NULL,
	status_flag bpchar(1) NULL,
	retained_earnings_flag bpchar(1) NULL DEFAULT 'N'::bpchar,
	transition_flag bpchar(1) NULL DEFAULT 'N'::bpchar,
	corporate_revenue_flag bpchar(1) NULL DEFAULT 'Y'::bpchar,
	dual_gaap_flag bpchar(1) NULL DEFAULT 'N'::bpchar,
	twotier_flag bpchar(1) NULL,
	gross_mgn_rollup1 varchar(50) NULL,
	gross_mgn_rollup2 varchar(50) NULL,
	gross_mgn_rollup3 varchar(70) NULL,
	gl_acct_number numeric(10) NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL,
	rule1 varchar(100) NULL,
	rule2 varchar(100) NULL,
	rule3 varchar(100) NULL,
	rule4 varchar(100) NULL,
	rule5 varchar(100) NULL,
	CONSTRAINT dfa_sub_measure_pkey PRIMARY KEY (sub_measure_key)
)

  id?: string;
  name: string;
  desc: string;
  sourceId: number;
  measureId: number;
  startFiscalMonth: string;
  endFiscalMonth: string;
  processingTime: string;
  pnlnodeGrouping: string;
  categoryType: string;
  inputFilterLevel = new InputFilterLevel();
  manualMapping = new InputFilterLevel();
  reportingLevels: string[] = [undefined, undefined, undefined];
  indicators = new Indicators();
  rules: string[] = [];
  groupedBySubmeasureId: number;
  status = 'I';
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;

CREATE TABLE fpadfa.dfa_sub_measure (
	module_id numeric(10) NOT NULL,
	sub_measure_key float8 NOT NULL,
	sub_measure_id float8 NOT NULL,
	sub_measure_name varchar(70) NOT NULL,
	sub_measure_description varchar(250) NULL,
	category_type varchar(20) NULL,
	grouped_by_smeasure_key float8 NULL,
	measure_id float8 NOT NULL,
 */
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
  {prop: 'categoryType', field: 'category_type'},
] ;

@injectable()
export default class SubmeasurePgRepo extends PgRepoBase {
  table = 'fpadfa.dfa_sub_measure';
  idProp = 'submeasureId';

  constructor() {
    super(new Orm(ormMap));
  }
}


/*
DROP TABLE fpadfa.dfa_data_sources;
DROP TABLE fpadfa.dfa_measure;
DROP TABLE fpadfa.dfa_module;
DROP TABLE fpadfa.dfa_open_period;
DROP TABLE fpadfa.dfa_prof_dept_acct_map_upld;
DROP TABLE fpadfa.dfa_prof_input_amnt_upld;
DROP TABLE fpadfa.dfa_prof_manual_map_upld;
DROP TABLE fpadfa.dfa_sub_measure;
DROP TABLE fpadfa.dfa_submeasure_input_lvl;
*/


CREATE TABLE fpadfa.dfa_data_sources (
	source_system_id numeric(22) NULL,
	source_system_name varchar(30) NOT NULL,
	source_system_type_code varchar(30) NOT NULL,
	status_flag bpchar(1) NULL,
	module_id numeric(4) NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
);

CREATE TABLE fpadfa.dfa_measure (
	module_id numeric(10) NULL,
	measure_id numeric(22) NOT NULL,
	measure_name varchar(100) NOT NULL,
	measure_type_code varchar(30) NOT NULL,
	sub_measure_approval_flag bpchar(1) NULL,
	sub_measure_notification_flag bpchar(1) NULL,
	status_flag bpchar(1) NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
);

CREATE TABLE fpadfa.dfa_module (
	module_id numeric(10) NOT NULL,
	module_abbr varchar(10) NULL,
	module_name varchar(60) NOT NULL,
	status_flag varchar(1) NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
);

CREATE TABLE fpadfa.dfa_open_period (
	module_id numeric(10) NOT NULL,
	fiscal_month_id numeric(10) NOT NULL,
	open_flag varchar(1) NOT NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
);

CREATE TABLE fpadfa.dfa_prof_dept_acct_map_upld (
	sub_measure_key numeric(22) NOT NULL,
	node_value varchar(32) NULL,
	gl_account varchar(5) NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
);

CREATE TABLE fpadfa.dfa_prof_input_amnt_upld (
	fiscal_month_id numeric(22) NOT NULL,
	measure_id numeric(22) NOT NULL,
	sub_measure_key numeric(22) NOT NULL,
	input_internal_be_hier_level_id numeric(3) NULL,
	input_internal_be_hier_level_name varchar(100) NULL,
	input_internal_be_value varchar(100) NULL,
	input_end_cust_hier_level_id numeric(3) NULL,
	input_end_cust_hier_level_name varchar(10) NULL,
	input_end_cust_value numeric(10) NULL,
	input_entity_hier_level_id numeric(3) NULL,
	input_entity_hier_level_name varchar(10) NULL,
	input_entity_value varchar(15) NULL,
	input_product_hier_level_id numeric(3) NULL,
	input_product_hier_level_name varchar(10) NULL,
	input_product_value varchar(40) NULL,
	input_sales_hier_level_id numeric(3) NULL,
	input_sales_hier_level_name varchar(10) NULL,
	input_sales_value varchar(32) NULL,
	input_scms_hier_level_id numeric(3) NULL,
	input_scms_hier_level_name varchar(10) NULL,
	input_scms_value varchar(30) NULL,
	deal_id varchar(100) NULL,
	gross_unbilled_accrued_rev_flg varchar(1) NULL,
	revenue_classification varchar(50) NULL,
	amount_value float8 NOT NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
);

CREATE TABLE fpadfa.dfa_prof_manual_map_upld (
	fiscal_month_id numeric(22) NOT NULL,
	measure_id numeric(22) NOT NULL,
	sub_measure_key numeric(22) NULL,
	input_internal_be_hier_level_id numeric(3) NULL,
	input_internal_be_hier_level_name varchar(100) NULL,
	input_internal_be_value varchar(100) NULL,
	input_end_cust_hier_level_id numeric(3) NULL,
	input_end_cust_hier_level_name varchar(10) NULL,
	input_end_cust_value numeric(10) NULL,
	input_entity_hier_level_id numeric(3) NULL,
	input_entity_hier_level_name varchar(10) NULL,
	input_entity_value varchar(15) NULL,
	input_product_hier_level_id numeric(3) NULL,
	input_product_hier_level_name varchar(10) NULL,
	input_product_value varchar(40) NULL,
	input_sales_hier_level_id numeric(3) NULL,
	input_sales_hier_level_name varchar(10) NULL,
	input_sales_value varchar(32) NULL,
	input_scms_hier_level_id numeric(3) NULL,
	input_scms_hier_level_name varchar(10) NULL,
	input_scms_value varchar(30) NULL,
	percentage_value float8 NOT NULL,
	system_roll_over_flag bpchar(1) NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL
);

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
	service_flag bpchar(1) NULL,
	CONSTRAINT dfa_sub_measure_pkey PRIMARY KEY (sub_measure_key)
);

CREATE TABLE fpadfa.dfa_submeasure_input_lvl (
	module_id float8 NULL,
	sub_measure_key float8 NOT NULL,
	hierarchy_id float8 NOT NULL,
	input_level_flag varchar(3) NOT NULL,
	level_id float8 NULL,
	level_name varchar(30) NULL,
	create_owner varchar(30) NULL,
	create_datetimestamp timestamp NULL,
	update_owner varchar(30) NULL,
	update_datetimestamp timestamp NULL,
	CONSTRAINT dfa_submeasure_input_lvl_pkey PRIMARY KEY (sub_measure_key, hierarchy_id, input_level_flag)
);

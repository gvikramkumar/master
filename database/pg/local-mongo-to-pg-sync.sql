
/*
delete from fpadfa.dfa_data_sources;
delete from fpadfa.dfa_measure;
delete from fpadfa.dfa_module;
delete from fpadfa.dfa_open_period;
delete from fpadfa.dfa_prof_dept_acct_map_upld;
delete from fpadfa.dfa_prof_input_amnt_upld;
delete from fpadfa.dfa_prof_manual_map_upld;
delete from fpadfa.fpadfa.dfa_prof_sales_split_pctmap_upld;
delete from fpadfa.dfa_prof_swalloc_manualmix_upld;
delete from fpadfa.dfa_sub_measure;
delete from fpadfa.dfa_submeasure_input_lvl;
*/

select * from fpadfa.dfa_data_sources;
select * from fpadfa.dfa_measure;
select * from fpadfa.dfa_module;
select * from fpadfa.dfa_open_period;
select * from fpadfa.dfa_prof_dept_acct_map_upld;
select * from fpadfa.dfa_prof_input_amnt_upld;
select * from fpadfa.dfa_prof_manual_map_upld;
select * from fpadfa.dfa_prof_sales_split_pctmap_upld;
select * from fpadfa.dfa_prof_scms_triang_altsl2_map_upld;
select * from fpadfa.dfa_prof_scms_triang_corpadj_map_upld;
select * from fpadfa.dfa_prof_swalloc_manualmix_upld;
select * from fpadfa.dfa_sub_measure;
select * from fpadfa.dfa_submeasure_input_lvl;

select * from fpadfa.dfa_data_sources;
select * from fpadfa.dfa_measure;
select * from fpadfa.dfa_module;
select * from fpadfa.dfa_open_period;
select * from fpadfa.dfa_sub_measure;
select * from fpadfa.dfa_submeasure_input_lvl;
select * from fpadfa.dfa_prof_dept_acct_map_upld;




select * from fpadfa.dfa_sub_measure where sub_measure_name = 'dank4sm';
select * from fpadfa.dfa_sub_measure where sub_measure_key = 1006132;
select * from fpadfa.dfa_submeasure_input_lvl where sub_measure_key = 1006132;
select * from fpadfa.dfa_submeasure_input_lvl where input_level_flag = 'M';

select create_owner, create_datetimestamp, update_owner, update_datetimestamp from fpadfa.dfa_sub_measure;

select * from fpadfa.dfa_data_sources;

select measure_id, sub_measure_key, sub_measure_name, input_product_family, alloc_product_family from fpadfa.dfa_sub_measure 
where sub_measure_key = 1055647;

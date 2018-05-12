const _ = require('lodash');

let str = 'measure_name,sub_measure_name,input_product_value,input_product_hier_level_id,input_product_hier_level_name,input_entity_value,input_entity_hier_level_id,input_entity_hier_level_name,input_sales_value,input_sales_hier_level_id,input_sales_hier_level_name,scms_value,scms_hier_level_id,scms_hier_level_name,input_business_value,input_business_hier_level_id,input_business_hier_level_name,deal_id,gross_unbilled_accrued_rev_flg,revenue_classification,amount\n,CREATED_BY,CREATED_DATE,UPDATED_BY,UPDATE_DATE';

const arr = str.split(',');
const chg = arr.map(x => _.camelCase(x)).join(',');
console.log(chg);

/*

allocation_rules
RULE_NAME,PERIOD,DRIVER_NAME,SALES_MATCH,PRODUCT_MATCH,SCMS_MATCH,LEGAL_ENTITY_MATCH,BE_MATCH,SL1_SELECT,SCMS_SELECT,BE_SELECT,CREATED_BY,CREAYED_DATE,UPDATED_BY,UPDATED_DATE
>>
name,period,driverName,salesMatch,productMatch,scmsMatch,legalEntityMatch,beMatch,sl1Select,scmsSelect,beSelect,createdBy,createdDate,updatedBy,updatedDate

submeasure_list
SUB_MEASURE_KEY,SUB_MEASURE_NAME
>>
key, name

submeasure_rule_map
SUB_MEASURE_NAME,RULE_NAME,SEQ_NUM,CREATED_BY,CREATED_DATE,UPDATED_BY,UPDATE_DATE
>>
subMeasureName,ruleName,seqNum,createdBy,createdDate,updatedBy,updatedDate


*/

const _ = require('lodash');

let str = 'SUB_MEASURE_NAME,RULE_NAME,SEQ_NUM,CREATED_BY,CREATED_DATE,UPDATED_BY,UPDATE_DATE';

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

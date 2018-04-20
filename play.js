const _ = require('lodash');

let str = 'RULE_NAME,PERIOD,DRIVER_NAME,SALES_MATCH,PRODUCT_MATCH,SCMS_MATCH,LEGAL_ENTITY_MATCH,BE_MATCH,SL1_SELECT,SCMS_SELECT,BE_SELECT,CREATED_BY,CREAYED_DATE,UPDATED_BY,UPDATED_DATE';

const arr = str.split(',');
const chg = arr.map(x => _.camelCase(x)).join(',');
console.log(chg);

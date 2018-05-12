const _ = require('lodash');

const a = {};

a['prop1'] = 'you can\'t do that';
a['prop2'] = 'you can\'t do that';
console.log(JSON.stringify(a,null,2));

const b = [];
b.push({prop: 'some prop', error: 'some error'});
b.push({prop: 'some prop', error: 'some error'});
console.log(JSON.stringify(b,null,2));



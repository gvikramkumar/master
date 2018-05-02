const _ = require('lodash');
const arr = [
  {addr: {street: 'lovell'}},
  {addr: {street: 'pinecrest'}}
];

console.log(_.find(arr, item => _.get(item, 'addr.street') === 'lovell'))













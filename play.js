const _ = require('lodash');


const allowed = ['one', 'two'];
const user = ['three', 'four', 'twoo'];

console.log(_.intersection(allowed, user).length > 0);

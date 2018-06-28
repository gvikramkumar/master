const _ = require('lodash'),
  Q = require('q');

function fcn(name) {
  if (!name) {
    name = 'dank';
  }
  console.log('name', name);

}

fcn();

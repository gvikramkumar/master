const _ = require('lodash'),
  Q = require('q');


Promise.resolve()
  .then(() => Promise.all([fgood(), fbad(), fgood()]))
/*
  .catch(err => {
    console.error('myerr', err);
    return Promise.reject(err);
  })
*/
  .then(x => console.log('success'))
  .catch(err => console.error('myerr', err));

function fbad() {
  _.sortBy5();
  return Promise.reject('rej');
}
function fgood() {
  return Promise.resolve();
}



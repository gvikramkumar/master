const _ = require('lodash'),
  Q = require('q');



let chain = Promise.resolve('start');
[500, 400, 300].forEach(time => {
  chain = chain.then(val => {
    return new Promise((res, rej) => {
      console.log('start', time, val);
      setTimeout(() => {
        console.log('res', time);
        res(val + time);
      }, time)
    })
      .then(() => {
        throw new Error('bad2');
      })
  })
})

chain
  .then(x => console.log(x))
  .catch(err => console.log('myerr', err))



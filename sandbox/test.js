const _ = require('lodash'),
  Q = require('q');


const arr = [{
  db: 'mydb',
  mongo: 'mymongo'
},
  {pgdb: 'mypg'}
  ];


const [{db, mongo}, {pgdb}] = arr;

console.log(db, mongo, pgdb);

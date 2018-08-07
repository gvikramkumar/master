/*
import {pgc} from '../server/lib/database/postgres-conn';

const a = pgc.promise;
pgc.promise.then(db => {
  console.log('postgres is up');
  process.exit();
})
  .catch(err => {
    console.log('postgres is down');
    console.error(err);
    process.exit();
  });
*/

import AnyObj from '../shared/models/any-obj';
import * as _ from 'lodash';
import {pgc} from '../server/lib/database/postgres-conn';
import {PgRepo} from './pgrepo';

const repo = new PgRepo();

const mine = [
  {moduleId: 1, name: 'dank', age: 51},
  {moduleId: 1, name: 'carl', age: 61},
  {moduleId: 1, name: 'jim'},
];

const aa = pgc.promise;
pgc.promise.then(db => {
  console.log('postgres is up');

/*
  repo.getOneById(389)
    .then(doc => {
      doc.name = 'jim2';
      repo.updateOneById(doc, 'jodoe');
    });

*/

/*
  repo.removeMany({}, false)
    .then(() => {
      repo.addMany(mine, 'jodoe')
      // repo.addOne(dbRecords[0], 'jodoe')
        .then(() => repo.getMany({}, false))
        .then(dbdocs => {
          return Promise.resolve();
        })
        .then(() => process.exit(0));
    })
    .catch(e => console.error(e));
*/


});



















// this is good, but we need to create a function that takes (schema.table, field, value), and a then function that tests this existence:
// function getExists = results => results.rows[0].exists;

/*
  db.query('select exists (select 1 from fdscon.vw_fds_products where product_family_id = $1 limit 1)', ['HCS'])
    .then(results => console.log(results.rows[0].exists))
    .catch(err => console.error('myerr', err));
*/

/*
  then
  util.doProductsExistsQuery('product_family_id', 'HCS')
    .then(extractExists)
    .then(bool => {
      if (false) {
        addError(); // and reject or not
      }
    })
*/



const pgc = require('../dist/server/lib/database/postgres-conn').pgc;

const a = pgc.promise;
pgc.promise.then(db => {
  console.log('postgres is up');
})
  .catch(err => {
    console.log('postgres is down');
    console.error(err);
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



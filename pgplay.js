
const pg = require('./server/lib/database/postgres-conn');


pg.promise.then(db => {

  db.query('select * from ')

})


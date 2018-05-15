
const pg = require('../server/lib/database/postgres-conn');


pg.promise.then(db => {

  db.query('SELECT * FROM finrpl.dw_job_stream_runs')
    .then(results => console.log(results.rows[0]))
    .catch(err => console.error('myerr', err));

})


const db = require('../postgres-conn').pgdb,
  config = require('../../../config/get-config').postgres;

module.exports = class PostgresRepo {

  checkForExistence(table, column, value) {
    return db.query(`select exists (select 1 from ${config.schema}.${table} where ${column} = $1 limit 1)`, [value])
      .then(results => results.rows[0].exists);
  }

}

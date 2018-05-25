const db = require('../postgres-conn').pgdb,
  config = require('../../../config/get-config').postgres;

module.exports = class PostgresRepo {

  checkForExistenceText(table, column, value) {
    return db.query(`select exists (select 1 from ${config.schema}.${table} where upper(${column}) = $1 limit 1)`, [value.toUpperCase()])
      .then(results => results.rows[0].exists);
  }

  getSortedUpperListFromColumn(table, column) {
    return db.query(`select distinct upper(${column}) as col from ${config.schema}.${table} order by upper(${column})`)
      .then(results => results.rows[0].map(obj => obj.col));
  }

}

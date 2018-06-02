const db = require('../postgres-conn').pgdb,
  config = require('../../../config/get-config').postgres,
  _ = require('lodash');

module.exports = class PostgresRepo {


  checkForExistenceText(table, column, value) {
    return db.query(`select exists (select 1 from ${config.schema}.${table} where upper(${column}) = $1 limit 1)`, [value.toUpperCase()])
      .then(results => results.rows[0].exists);
  }

  getSortedUpperListFromColumn(table, column, whereClause) {
    let query = `select distinct upper(${column}) as col from ${config.schema}.${table}`;
    if (whereClause) {
      query += ' where ' + whereClause;
    }
    query += ` order by upper(${column})`;

    return db.query(query)
      .then(results => results.rows.map(obj => obj.col))
      .then(results => _.sortBy(results, _.identity));
  }

}

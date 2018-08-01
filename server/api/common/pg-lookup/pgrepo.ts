import {injectable} from 'inversify';
import {pgc} from '../../../lib/database/postgres-conn';


@injectable()
export class PostgresLookupRepo {

  constructor() {
  }

  // get: JUL FY2018	, 201812 for this year and last in descending order (latest to earliest)
  getFiscalMonths() {
    return pgc.pgdb.query(`
            select fiscal_month_name, fiscal_year_month_int from
            fpacon.vw_fpa_fiscal_month_to_year
            where fiscal_year_age between 0 and 1
            order by fiscal_year_month_int desc
          `);
  }

}

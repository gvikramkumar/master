import LookupRepo from '../../api/lookup/repo';
import {mgc} from '../database/mongoose-conn';
import PgLookupRepo from '../../api/pg-lookup/repo';

const lookupRepo = new LookupRepo();
const pgLookupRepo = new PgLookupRepo();

export function healthcheck () {

  return (req, res, next) => {
    Promise.all([
      lookupRepo.getValues(['build-number', 'database-version']),
      mgc.db.admin().serverInfo(),
      pgLookupRepo.getDbVersion()
    ])
      .then(results => {
        const rtn = {
          api: `build: ${results[0][0]}`,
          mongo: `dfa-version: ${results[0][1]}, mongo-version: ${results[1].version}`,
          pg: results[2]
        };
        res.json(rtn);
      })
      .catch(next);
  };

}



import LookupRepo from '../../api/common/lookup/repo';
import {mgc} from '../database/mongoose-conn';
import PgLookupRepo from '../../api/common/pg-lookup/repo';

const lookupRepo = new LookupRepo();
const pgLookupRepo = new PgLookupRepo();

export function healthcheck () {

  return (req, res, next) => {
    Promise.all([
      lookupRepo.getValue('build-number'),
      mgc.db.admin().serverInfo(),
      pgLookupRepo.getDbVersion()
    ])
      .then(results => {
        const rtn = {
          api: results[0],
          mongo: results[1].version,
          pg: results[2]
        };
        res.json(rtn);
      })
      .catch(next);
  };

}



import _config from './config/get-config';
import * as fs from 'fs';
import * as _ from 'lodash';
import LookupRepo from './api/common/lookup/repo';
import {ApiError} from './lib/common/api-error';

interface DatabaseUpdate {
  fileName: string;
  version: number;
}

const config = _.config.mongo;

export function databaseUpdate() {
  if (process.env.NODE_ENV === 'unit') {
    return Promise.resolve();
  }

  const lookupRepo = new LookupRepo();
  /*
  1. get version
  2. get files.map >> (fileName, version) and sort by version number
  3. get max version
  4. compare curver to maxver and slice array to diff
  5. walk array building promise chain of updateFunction(fileName, version) >> Q.npInvoke(cp.exec).then(updatedbVersion)
   */

  const files = fs.readdirSync('database/updates').filter(file => /update_\d{1,3}.js/i.test(file));
  // files = _.sortBy(files, x => Number(/^.*_(\d{1,3}).js$/i.exec(x)[1]));
  let updates: DatabaseUpdate[] = files.map(fileName => ({
    fileName,
    version: Number(/^.*_(\d{1,3}).js$/i.exec(fileName)[1])
  }));
  updates = _.sortBy(updates, 'version');
  const latestVersion = updates[updates.length - 1].version;
  lookupRepo.getValue('database-version')
    .then(version => {
      const databaseVersion = version;
      const dbUpdateIndex = _.findIndex(updates, {version: databaseVersion});
      if (dbUpdateIndex === -1) {
        throw new ApiError(`databaseUpdate: couldn't find dbUpdateIndex.`);
      }
      updates = updates.slice(dbUpdateIndex + 1);
      if (updates.length > 0) {
        console.log(`Database requires updates: ${databaseVersion}`);
        let chain = <Promise<any>>Promise.resolve();
        updates.forEach(update => {
          chain = chain.then(() => doUpdate(update));
        });
        return chain;
      } else {
        console.log(`Database already on latest version: ${databaseVersion}`);
        return Promise.resolve();
      }
    });


}

function doUpdate(update) {
  return new Promise((resolve, reject) => {
    let str = `mongo --nodb  --eval "var host='${config.host}', port='${config.port}', _db='${config.db}'" database/updates/${update.fileName}`;
    console.log(str);
    resolve();
  });
}

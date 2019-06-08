import _config from './config/get-config';
import fs from 'fs';
import _ from 'lodash';
import LookupRepo from './api/lookup/repo';
import {ApiError} from './lib/common/api-error';
import {exec} from 'child_process';
import {nfcall} from 'q';
import {svrUtil} from './lib/common/svr-util';

interface DatabaseUpdate {
  fileName: string;
  version: number;
}

const config = _config.mongo;
const lookupRepo = new LookupRepo();
const build_number = process.env.BUILD_NUMBER;

export function databaseUpdate() {
  if (svrUtil.isUnitEnv()) {
    return Promise.resolve();
  }

  if (!svrUtil.isLocalEnv && !build_number) {
    throw new ApiError('No BUILD_NUMBER environment variable.');
  }

  /*
  1. get version
  2. get files.map >> (fileName, version) and sort by version number
  3. get max version
  4. compare curver to maxver and slice array to diff
  5. walk array building promise chain of updateFunction(fileName, version) >> Q.npInvoke(cp.exec).then(updatedbVersion)
   */

  const files = fs.readdirSync('database/updates').filter(file => /^update_\d{1,4}.js$/i.test(file));
  // files = _.sortBy(files, x => Number(/^.*_(\d{1,4}).js$/i.exec(x)[1]));
  // console.log(files);
  // return Promise.reject();

  let updates: DatabaseUpdate[] = files.map(fileName => ({
    fileName,
    version: Number(/^.*_(\d{1,4}).js$/i.exec(fileName)[1])
  }));
  updates = _.sortBy(updates, 'version');
  const latestVersion = updates.length === 0 ? 0 : updates[updates.length - 1].version;
  return lookupRepo.getValue('database-version')
    .then(version => {
      const databaseVersion = version;
      if (databaseVersion > latestVersion) {
        return Promise.reject(`Database update version: ${databaseVersion} is greater than code update version: ${latestVersion}`);
      }
      let dbUpdateIndex = _.findIndex(updates, {version: databaseVersion});
      dbUpdateIndex = dbUpdateIndex === -1 ? 0 : dbUpdateIndex + 1;
      if (dbUpdateIndex !== 0) {
        updates = dbUpdateIndex >= updates.length ? [] : updates.slice(dbUpdateIndex);
      }
      if (updates.length > 0) {
        console.log(`Database requires updates, current version: ${databaseVersion}`);
        let chain = <Promise<any>>Promise.resolve();
        updates.forEach(update => {
          chain = chain.then(() => doUpdate(update));
        });
        chain.then(() => {
          return   lookupRepo.getValue('database-version')
            .then(endVersion => {
              console.log(`database update complete, has been updated to version: ${endVersion}`);
              return updateBuildNumber();
            });
        })
          .catch(err => Promise.reject(err));
        return chain;
      } else {
        console.log(`database already on latest version: ${databaseVersion}`);
        return updateBuildNumber();
      }
    });

}

function updateBuildNumber() {
  if (svrUtil.isLocalEnv() && !build_number) {
    return;
  }
  return lookupRepo.upsert({key: 'build-number', value: build_number});
}

function doUpdate(update) {
  return new Promise((resolve, reject) => {
    console.log(`starting database update: ${update.version}`);
    const str = `mongo --nodb  --eval "var host='${config.host}', port='${config.port}', _db='${config.db}', username='${process.env.MONGODB_USER}', password='${process.env.MONGODB_PASSWORD}'" database/updates/${update.fileName}`;
    exec(str, (err, stdio, stderr) => {
      if (err) {
        console.log('/////////////////// stderr');
        console.log(stderr);
        console.log('/////////////////// stdio');
        console.log(stdio);
        console.log('/////////////////// error');
        reject(err);
      } else {
        lookupRepo.upsert({key: 'database-version', value: update.version})
          .then(() => {
            console.log(`database updated to version: ${update.version}`);
            resolve();
          });
      }
    });
  });
}

import LookupRepo from '../../api/lookup/repo';
import config from '../../config/get-config';
import {finRequest} from './fin-request';
import {shUtil} from '../../../shared/misc/shared-util';
import _ from 'lodash';
import {injectable} from 'inversify';
import {dfaJobs} from '../../api/run-job/controller';


@injectable()
export class ServerStartup {
  // jobs = dfaJobs.filter(x => x.singleServer);
  singleServerJobs = dfaJobs.filter(x => x.singleServer);
  multipleServerJobs = dfaJobs.filter(x => !x.singleServer);

  constructor(private lookupRepo: LookupRepo) {
  }

  startup() {
    return this.lookupRepo.getValues(this.singleServerJobs.map(x => x.lookupRunningKey))
      .then(values => {
        const keys = [];
        const serverUrl = (<any>global).dfa.serverUrl;
        this.singleServerJobs.forEach((job, idx) => {
          if (values[idx] === serverUrl) {
            keys.push(job.lookupRunningKey);
          }
        })
        const promise: any = keys.length ? this.lookupRepo.removeByKeys(keys) : Promise.resolve();
        return promise
          .then(() => {
            if (config.multipleServers) {
              // make sure server job flags don't get stuck on. All servers will check this periodically
              setInterval(this.clearServerLookupFlags.bind(this), 60 * 1000);
              this.clearServerLookupFlags();
            }
          });
      });
  }

  // ping server and return serverUrl if fails
  pingServer(serverUrl) {
    return shUtil.promiseChain(finRequest({url: `${serverUrl}/ping`}))
      .then(({resp, body}) => {
        if (resp.statusCode >= 400) {
          return serverUrl;
        }
      })
      .catch(err => {
        return serverUrl;
      });
  }

  // get flags from lookup, they'll have serverUrls for them, then ping servers and if not there, remove the flags
  // what we're doing here is clearing the flags that says server is busy doing something, when server is no longer there
  clearServerLookupFlags() {
    return this.lookupRepo.getValues(this.singleServerJobs.map(x => x.lookupRunningKey))
      .then(values => {
        const pingPromises = [];
        values.forEach((val, idx) => pingPromises.push(val ? this.pingServer(this.singleServerJobs[idx].lookupRunningKey) : Promise.resolve()));
        Promise.all(pingPromises)
          .then(missingServers => {
            if (missingServers.filter(x => !!x).length) {
              const keys = [];
              missingServers.forEach((serverUrl, idx) => {
                if (serverUrl) {
                  keys.push(this.singleServerJobs[idx].lookupRunningKey);
                }
              })
              this.lookupRepo.removeByKeys(keys);
            }
          });
      });
  }

}







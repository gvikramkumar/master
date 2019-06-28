import LookupRepo from '../../api/lookup/repo';
import config from '../../config/get-config';
import {finRequest} from './fin-request';
import {shUtil} from '../../../shared/misc/shared-util';
import _ from 'lodash';
import {injectable} from 'inversify';


@injectable()
export class ServerStartup {

  constructor(private lookupRepo: LookupRepo) {
  }

  startup() {
    // if syncing or uploading is this server (we set them to serverHost names), clear it cause we just started again
    return this.lookupRepo.getValues(['syncing', 'uploading'])
      .then(values => {
        const syncing = values[0];
        const uploading = values[1];
        const keys = [];
        if (syncing === (<any>global).dfa.serverHost) {
          keys.push('syncing');
        }
        if (uploading === (<any>global).dfa.serverHost) {
          keys.push('uploading');
        }
        const promise: any = keys.length ? this.lookupRepo.removeByKeys(keys) : Promise.resolve();
        return promise
          .then(() => {
            if (config.checkServerFlags) {
              // there's servers that set the global server flags. Need to start a job to check if flag gets stuck on
              // when server goes down, can't have that
              setInterval(this.clearServerLookupFlags.bind(this), 60 * 1000);
              this.clearServerLookupFlags();
            }
          });
      });
  }

  // ping server and return serverHost if fails
  pingServer(serverHost) {
    return shUtil.promiseChain(finRequest({url: `${serverHost}/ping`}))
      .then(({resp, body}) => {
        if (resp.statusCode >= 400) {
          return serverHost;
        }
      })
      .catch(err => {
        return serverHost;
      });
  }

  // get flags from lookup, they'll have serverUrls for them, then ping servers and if not there, remove the flags
  // what we're doing here is clearing the flags that says server is busy doing something, when server is no longer there
  clearServerLookupFlags() {
    this.lookupRepo.getValues(['syncing', 'uploading'])
      .then(values => {
        const syncing = values[0];
        const uploading = values[1];
        const pingPromises = [
          syncing ? this.pingServer(syncing) : Promise.resolve(),
          uploading ? this.pingServer(uploading) : Promise.resolve(),
        ];

        Promise.all(pingPromises)
          .then(missingServers => {
            if (missingServers.filter(x => !!x).length) {
              const keys = [];
              if (missingServers[0]) {
                keys.push('syncing');
              }
              if (missingServers[1]) {
                keys.push('uploading');
              }
              if (keys.length) {
                this.lookupRepo.removeByKeys(keys);
              }
            }
          });
      });
  }

}







import {injectable} from 'inversify';
import JobLogRepo from './job-log-repo';
import {DfaJobLog} from './job-log';
import {SyncMap} from '../../../shared/models/sync-map';
import {handleQAllSettled} from '../../lib/common/q-allSettled';
import Q from 'q';
import _ from 'lodash';
import {ApiError} from '../../lib/common/api-error';
import DatabaseController from '../database/controller';
import SubmeasureController from '../common/submeasure/controller';
import AllocationRuleController from '../common/allocation-rule/controller';
import LookupRepo from '../lookup/repo';
import config from '../../config/get-config';
import {shUtil} from '../../../shared/misc/shared-util';
import {finRequest} from '../../lib/common/fin-request';


type DfaJobFunction = (startup?: boolean, data?, req?) => Promise<any>;

interface DfaJob {
  name: string;
  displayName: string;
  param: string;
  singleServer: boolean;
}

export const dfaJobs = [
  {name: 'databaseSync', displayName: 'Database Sync', param: 'database-sync',
    fcn: this.databaseSyncJob.bind(this), singleServer: true, log: true},
  {name: 'approvalEmailReminder', displayName: 'Approval Email Reminder', param: 'approval-email-reminder',
    fcn: this.approvelEmailReminderJob.bind(this), singleServer: true, log: true},
  {name: 'clearServerLookupFlagsJob', displayName: 'Clear Server Lookup Flags', fcn: this.clearServerLookupFlagsJob.bind(this), period: 5 * 1000, runOnStartup: true}
];

@injectable()
export default class RunJobController {
  singleServerJobs = dfaJobs.filter(x => x.singleServer);
  multipleServerJobs = dfaJobs.filter(x => !x.singleServer);

  constructor(
    private jobLogRepo: JobLogRepo,
    private lookupRepo: LookupRepo,
    private submeasureController: SubmeasureController,
    private ruleController: AllocationRuleController,
    private databaseController: DatabaseController
  ) {
  }

  //
  startup() {
    const multipleServerJobs = dfaJobs.filter(x => !x.singleServer);
    if (!config.multipleServers) {
      _.pull(multipleServerJobs, {name: 'clearServerLookupFlagsJob'});
    }
    multipleServerJobs.filter(x => x.period)
      .forEach(job => setInterval(job.fcn, job.period));
    const promises = [];
    multipleServerJobs.forEach(job => {
      if (job.runOnStartup) {
        promises.push(job.fcn(true));
      }
    });
    return Q.allSettled(promises)
      .then(results => handleQAllSettled(null, 'serverStartup'));
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

  log(canLog, log, req?) {
    if (canLog) {
      log.userId = _.get(req, 'user.id') || 'system';
      return this.jobLogRepo.addOne(log, log.userId, false);
    } else {
      return Promise.resolve();
    }
  }

  isDatabaseSyncJob(job) {
    return job.name === 'databaseSync';
  }

  isJobRunning(job: DfaJob) {
    let promise;
    if (job.singleServer) {
      promise = this.lookupRepo.getValues([job.name, 'uploading'])
        .then(values => {
          const running = values[0];
          const uploading = values[1];
          return {running, uploading};
        });
    } else {
      promise = Promise.resolve(_.get(global, `dfa.${job.name}`));
    }
    return promise.then((running, uploading) => {
      if (running) {
        return `${job.displayName} job is already running.`;
      } else if (this.isDatabaseSyncJob(job) && uploading) {
        return `Upload in progress, please try again later.`;
      }
    });
  }

  runJobAndRespond(req, res, next) {
    const jobName = req.params['jobName'];
    Promise.resolve()
      .then(() => {
        return this.runJob(jobName, false, req.body || req.query, req);
      })
      .then(log => res.json(log))
      .catch(next);
  }

  runJob(jobName, startup = false, data?, req?) {
    const job = _.find(dfaJobs, {param: jobName});
    if (!job) {
      throw new Error(`Job not found: ${jobName}`);
    }
    const log = <DfaJobLog>{
      host: _.get(global, 'dfa.serverHost'),
      jobName,
      startDate: new Date(),
      data,
      status: 'starting'
    };
    return this.isJobRunning(job)
      .then(running => {
        if (running) {
          log.status = 'already running';
          return this.log(job.log, log, req)
            .then(() => {
              return Promise.reject(new ApiError (running));
            });
        }
      })
      .then(() => {
        return this.log(job.log, log, req)
          .then(() => {
            return job.fcn(startup, data, req);
          })
          // job success
          .then(jobData => {
            log.endDate = new Date();
            log.duration = log.endDate.getTime() - log.startDate.getTime();
            log.status = 'success';
            log.data = jobData;
            return this.log(job.log, log, req);
          })
          // job error
          .catch(err => {
            log.endDate = new Date();
            log.duration = log.endDate.getTime() - log.startDate.getTime();
            log.status = 'error';
            log.error = err;
            return this.log(true, log, req)
              .then(logSaved => {
                throw new ApiError(_.get(err, 'message') || 'Run Job Error' , logSaved.toObject());
              });
          });
      });
  }

  databaseSyncJob(startup, syncMap?, req?) {
    // if (!req)  put this together. const req = _.set({}, 'dfa.fiscalMonths', ??);
    const userId = req.userId || 'system';
    return this.databaseController.mongoToPgSyncPromise(req.dfa, syncMap, userId);
  }

  approvelEmailReminderJob() {
    Q.allSettled([
      this.submeasureController.approvalEmailReminder('submeasure'),
      this.ruleController.approvalEmailReminder('rule')
    ])
      .then(results => handleQAllSettled(null, 'qAllReject'));
  }

  // get flags from lookup, they'll have serverUrls for them, then ping servers and if not there, remove the flags
  // what we're doing here is clearing the flags that says server is busy doing something, when server is no longer there
  clearServerLookupFlagsJob(startup) {
    if (startup) {
      return this.lookupRepo.getValues(this.singleServerJobs.map(x => x.name))
        .then(values => {
          const keys = [];
          const serverUrl = (<any>global).dfa.serverUrl;
          this.singleServerJobs.forEach((job, idx) => {
            if (values[idx] === serverUrl) {
              keys.push(job.name);
            }
          });
          const promise: any = keys.length ? this.lookupRepo.removeByKeys(keys) : Promise.resolve();
          return promise;
        });
    } else {
      return this.lookupRepo.getValues(this.singleServerJobs.map(x => x.name))
        .then(values => {
          const pingPromises = [];
          values.forEach((val, idx) => pingPromises.push(val ? this.pingServer(this.singleServerJobs[idx].name) : Promise.resolve()));
          Promise.all(pingPromises)
            .then(missingServers => {
              if (missingServers.filter(x => !!x).length) {
                const keys = [];
                missingServers.forEach((serverUrl, idx) => {
                  if (serverUrl) {
                    keys.push(this.singleServerJobs[idx].name);
                  }
                });
                return this.lookupRepo.removeByKeys(keys);
              }
            });
        });
    }
  }

}

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
import {svrUtil} from '../../lib/common/svr-util';


type DfaJobFunction = (startup?: boolean, data?, req?) => Promise<any>;

export interface DfaJob {
  name: string;
  displayName: string;
  singleServer?: boolean;
  log?: boolean;
  period?: number;
  runOnStartup?: boolean;
}

const RUNNING_JOBS = 'runningJobs';
const DFA_RUNNING_JOBS = 'dfa.runningJobs';
const SYNCING = 'databaseSync';
const UPLOADING = 'uploading';

export const dfaJobs: DfaJob[] = [
  {name: 'databaseSync', displayName: 'Database Sync', singleServer: true, log: true},
  {name: 'approvalEmailReminder', displayName: 'Approval Email Reminder', singleServer: true, log: true},
  {name: 'clearServerLookupFlags', displayName: 'Clear Server Lookup Flags', runOnStartup: false, log: true} // period: 5 * 1000,
];

@injectable()
export default class RunJobController {
  singleServerJobs = dfaJobs.filter(x => x.singleServer);
  multipleServerJobs = dfaJobs.filter(x => !x.singleServer);
  serverUrl;

  constructor(
    private jobLogRepo: JobLogRepo,
    private lookupRepo: LookupRepo,
    private submeasureController: SubmeasureController,
    private ruleController: AllocationRuleController,
    private databaseController: DatabaseController
  ) {
  }

  // setInterval jobs that run on each server and have period set, then run any multipleServer jobs with runOnStartup set
  startup() {
    this.serverUrl = (<any>global).dfa.serverUrl;

    const multipleServerJobs = dfaJobs.filter(x => !x.singleServer);
    if (!config.multipleServers) {
      _.pullAllBy(multipleServerJobs, [{name: 'clearServerLookupFlags'}], 'name');
    }
    multipleServerJobs.filter(x => x.period)
      .forEach(job => setInterval(this.runJob.bind(this, job.name), job.period));
    const promises = [];
    multipleServerJobs.filter(x => x.runOnStartup)
      .forEach(job => {
        promises.push(this.runJob(job.name, true));
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
      promise = this.lookupRepo.getValue(RUNNING_JOBS)
        .then(runningJobs => {
          const running = _.get(runningJobs, job.name);
          const uploading = _.get(runningJobs, UPLOADING);
          return {running, uploading};
        });
    } else {
      promise = Promise.resolve({running: _.get(global, `${DFA_RUNNING_JOBS}.${job.name}`)});
    }
    return promise.then(({running, uploading}) => {
      if (running) {
        return `${job.displayName} job is already running.`;
      } else if (this.isDatabaseSyncJob(job) && uploading) {
        return `Upload in progress, please try again later.`;
      }
    });
  }

  setJobRunning(job: DfaJob) {
    let promise;
    if (job.singleServer) {
      promise = this.lookupRepo.setJobRunning(job.name);
    } else {
      promise = Promise.resolve(_.set(global, `${DFA_RUNNING_JOBS}.${job.name}`, true));
    }
    return promise;
  }

  clearJobRunning(job: DfaJob) {
    let promise;
    if (job.singleServer) {
      promise = this.lookupRepo.clearJobRunning(job.name);
    } else {
      promise = Promise.resolve(_.set(global, `${DFA_RUNNING_JOBS}.${job.name}`, false));
    }
    return promise;
  }

  runJobAndRespond(req, res, next) {
    const jobName = req.params['jobName'];
      shUtil.promiseChain(this.runJob(jobName, false, req.body || req.query, req))
      .then(log => res.json(log))
      .catch(err => {
        next(err);
      });
  }

  runJob(jobName, startup = false, data?, req?) {
    const job = _.find(dfaJobs, {name: jobName});
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
          return this.log(true, log, req) // we always log 'already running'
            .then(() => {
              return Promise.reject(new ApiError(running));
            });
        }
      })
      .then(() => {
        return shUtil.promiseChain([
          this.log(job.log, log, req),
          this.setJobRunning(job)
        ])
          .then(() => {
            return this[job.name](startup, data, req);
          })
          // job success
          .then(jobData => {
            log.endDate = new Date();
            log.duration = log.endDate.getTime() - log.startDate.getTime();
            log.status = 'success';
            log.data = jobData;
            return Promise.all([
              this.log(job.log, log, req),
              this.clearJobRunning(job)
            ])
              .then(results => results[0]);
          })
          // job error
          .catch(err => {
            log.endDate = new Date();
            log.duration = log.endDate.getTime() - log.startDate.getTime();
            log.status = 'error';
            log.error = svrUtil.getErrorForJson(err);
            return Promise.all([
              this.log(true, log, req), // we always log errors
              this.clearJobRunning(job)
            ])
              .then(results => {
                throw new ApiError(_.get(err, 'message') || 'Run Job Error', results[0].toObject());
              });
          });
      });
  }

  databaseSync(startup, syncMap?, req?) {
    // if (!req)  put this together. const req = _.set({}, 'dfa.fiscalMonths', ??);
    const userId = req.userId || 'system';
    return this.databaseController.mongoToPgSyncPromise(req.dfa, syncMap, userId);
  }

  approvalEmailReminder() {
    Q.allSettled([
      this.submeasureController.approvalEmailReminder('submeasure'),
      this.ruleController.approvalEmailReminder('rule')
    ])
      .then(results => handleQAllSettled(null, 'qAllReject'));
  }

  // get runningJobs from lookup. If startup, remove this serverUrl from any that match.
  // If not startup, loop through all set values and ping servers, removing any values if server doesn't respond
  clearServerLookupFlags(startup) {
    if (startup) {
      return this.lookupRepo.getDoc(RUNNING_JOBS)
        .then(doc => {
          if (doc) {
            const runningJobs = doc.value;
            this.singleServerJobs.forEach(job => {
              if (runningJobs[job.name] === this.serverUrl) {
                runningJobs[job.name] = undefined;
                doc.markModified('value');
              }
            });
            const promise: any = doc.isModified() ? doc.save() : Promise.resolve();
            return promise;
          }
        });
    } else {
      return this.lookupRepo.getDoc(RUNNING_JOBS)
        .then(doc => {
          if (doc) {
            const runningJobs = doc.value;
            const pingPromises = [];
            this.singleServerJobs.forEach(job => {
              if (runningJobs[job.name]) {
                pingPromises.push(this.pingServer(runningJobs[job.name]));
              }
            });
            return Promise.all(pingPromises)
              .then(missingServers => {
                missingServers = missingServers.filter(x => !!x);
                if (missingServers.length) {
                  missingServers.forEach(serverUrl => {
                    Object.keys(runningJobs).forEach(key => {
                      if (runningJobs[key] === serverUrl) {
                        runningJobs[key] = undefined;
                        doc.markModified('value');
                      }
                    });
                  });
                  const promise: any = doc.isModified() ? doc.save() : Promise.resolve();
                  return promise;
                }
              });
          }
        });
    }
  }

}

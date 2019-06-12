import JobConfigRepo from './job-config-repo';
import ServerRepo from './server-repo';
import {app} from '../../express-setup';
import AnyObj from '../../../shared/models/any-obj';
import AllocationRuleController from '../../api/common/allocation-rule/controller';
import SubmeasureController from '../../api/common/submeasure/controller';
import _ from 'lodash';
import {finRequest} from '../common/fin-request';
import {shUtil} from '../../../shared/misc/shared-util';
import {ApiError} from '../common/api-error';
import {svrUtil} from '../common/svr-util';
import {SyncMap} from '../../../shared/models/sync-map';
import Q from 'q';
import {handleQAllSettled} from '../common/q-allSettled';
import JobRunRepo from './job-run-repo';
import JobLogRepo from './job-log-repo';
import moment from 'moment';

type DfaJobFunction = (startup?: boolean, data?) => Promise<any>;

interface DfaPeriodicJob {
  name: string;
  timerId: number;
}

/*
    name: {type: String, required: true},
    period: Number,
    startTime: String,
    runOnStartup: {type: Boolean, required: true},
    log: {type: Boolean, required: true},
    active: {type: Boolean, required: true},
    primary: {type: Boolean, required: true}, // only runs on primary server
    primaryServerUrl: String, // identify server running primary job

 */
class DfaJob {
  // properties
  id?: string;
  name: string;
  period?: number;
  startTime?: string;
  runOnStartup: boolean;
  log: boolean;
  active: boolean;
  primary: boolean;
  primaryServerUrl: string;

  constructor(data) {
    Object.assign(this, data);
  }

}

/*
  {
    serverUrl: {type: String, required: true},
    jobName: {type: String, required: true},
    userId: {type: String, required: true},
    startDate: Date,
    endDate: Date,
    duration: String,
    running: {type: Boolean, required: true},
    status: String,
    data: Object,
  },

 */
class DfaJobRun {
  serverUrl: string;
  jobName: string;
  userId = 'system';
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  running?: boolean;
  status?: string;
  data?: AnyObj;
  error?: AnyObj;

  constructor(data = {}) {
    Object.assign(this, data);
  }
}

/*
    serverUrl: {type: String, required: true},
    jobName: {type: String, required: true},
    userId: {type: String, required: true},
    startDate: Date,
    endDate: Date,
    duration: String,
    running: {type: Boolean, required: true},
    status: String,
    data: Object,
    message: String,
    timestamp: {type: Date, default: new Date()},
 */
class DfaJobLog extends DfaJobRun {
  message?: string;
  timestamp?: Date;

  constructor(run: DfaJobRun, message?) {
    super(run);
    this.message = message;
  }

}

class DfaServer {
  id?: string;
  name: string;
  url: string;
  primary: boolean;
  updatedDate: Date;
}

interface DfaPeriodicJobInstance {
  job: DfaJob;
  timerId: number;
}

export class JobManager {
  serverUrl: string;
  periodicJobs: DfaPeriodicJobInstance[]  = [];

  constructor(
    private jobConfigRepo: JobConfigRepo,
    private jobRunRepo: JobRunRepo,
    private jobLogRepo: JobLogRepo,
    private serverRepo: ServerRepo,
    private submeasureController: SubmeasureController,
    private ruleController: AllocationRuleController
  ) {
  }

  getActiveJobConfigs(filter = {}) {
    return this.jobConfigRepo.getMany(Object.assign({active: true}, filter));
  }

  serverStartup() {
    this.serverUrl = app.get('serverUrl');
    this.getActiveJobConfigs()
      .then(jobs => {
        jobs.filter(x => !x.primary && x.period)
          .forEach(job => this.startPeriodicJob(job));
        jobs.filter(x => !x.primary && x.startTime && x.runOnStartup)
          .forEach(job => this.runJob(job, true));
      });
  }

  getJobFcnFromName(name): DfaJobFunction {
    let fcn;
    switch (name) {
      case 'primary-determination':
        fcn = this.primaryDeterminationJob;
        break;
      case 'start-primary-jobs':
        fcn = this.startPrimaryJobsJob();
        break;
      case 'check-start-time-jobs':
        fcn = this.checkStartTimeJobsJob;
        break;
      case 'database-sync':
        fcn = this.databaseSyncJob;
        break;
      case 'approval-email-reminder':
        fcn = this.approvelEmailReminderJob;
        break;
    }
    return fcn;
  }

  /*
   * handle running of all jobs, so one common place to check for:
   * isRunning, active, update runDate, etc
   */
  /*
    getRunJobFunction(job: DfaJob) {
      return ((startup, data?) => {
        // do all that junk
        const fcn = this.getJobFcnFromName(job.name);
      }).bind(this);

    }
  */


  /*
      serverUrl: {type: String, required: true},
    name: {type: String, required: true},
    userId: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    duration: {type: String, required: true},
    running: {type: Boolean, required: true},
    status: {type: String, required: true},
    data: Object

   */

  runUpdate(run, req?) {
    run.userId = _.get(req, 'user.id') || 'system';
    return this.jobRunRepo.upsertMerge(run, run.userId, false);
  }

  log(canLog, run, message, req?) {
    if (canLog) {
      const log = new DfaJobLog(run, message);
      return this.jobLogRepo.addOne(log, req.userId || log.userId || 'system', false);
    } else {
      return Promise.resolve();
    }
  }

  runUpdateAndLog(run, req, canLog, message) {
    return Promise.all([
      this.runUpdate(run, req),
      this.log(canLog, run, message)
    ])
      .then(results => results[0]); // return the job run
  }

  getJobRun(jobName) {
    return this.jobRunRepo.getOneByQuery({name: jobName, serverUrl: this.serverUrl});
  }

  runJob(job: DfaJob, startup = false, data?, req?) {
    return Promise.all([
      this.getActiveJobConfigs(),
      this.getJobRun(job.name)
    ])
      // start
      .then(results => {
        const jobs = results[0];
        const run = <DfaJobRun>results[1] || new DfaJobRun({name: job.name, serverUrl: this.serverUrl});
        // /api/run-job calls with jobName
        if (typeof job === 'string') {
          const jobName = job;
          job = _.find(jobs, {name: job});
          if (!job) {
            this.log(true, {}, `JobManager.runJob /api/run-job: no job found for jobName: ${job}`);
          }
        }
        if (run.running) {
          const log = <DfaJobRun>{
            serverUrl: this.serverUrl,
            jobName: job.name
          };
          return this.log(job.log, log, 'job already running');
        } else {
          delete run.endDate;
          delete run.duration;
          run.running = true;
          run.startDate = new Date();
          return this.runUpdateAndLog(run, req, job.log, 'job starting')
            .then(() => this.getJobFcnFromName(job.name)(startup, data));
        }
      })
      // job success
      .then(jobData => {
        return this.getJobRun(job.name)
          .then(run => {
            run.running = false;
            run.endDate = new Date();
            run.duration = run.endDate.getTime() - run.startDate.getTime();
            run.data = jobData;
            return this.runUpdateAndLog(run, req, job.log, 'job run error'); // return the job run
          });
      })
      // job error
      .catch(err => {
        return this.getJobRun(job.name)
          .then(_run => {
            const run = <DfaJobRun>_run;
            run.running = false;
            run.endDate = new Date();
            run.duration = run.endDate.getTime() - run.startDate.getTime();
            run.error = err;
            return this.runUpdateAndLog(run, req, job.log, 'job run error'); // return the job run
          });
      });
  }

  startPeriodicJob(job: DfaJob) {
    const timerId = setInterval(this.runJob.bind(this, job), job.period);
    this.periodicJobs.push({job: job, timerId});
    if (job.runOnStartup) {
      this.runJob(job, true);
    }
  }

  primaryDeterminationJob(startup: boolean) {
    const promises = [];
    this.serverRepo.getMany()
      .then(servers => {
        const thisServer = _.find(servers, {name: this.serverUrl});
        if (startup && thisServer) {
          // remove yourself from primary jobs, all primary starts are done by startPrimaryJobs so we don't get duplicate primary jobs
          promises.push(this.jobConfigRepo.updateMany({
            primary: true,
            primaryServerUrl: thisServer.url
          }, {$unset: {primaryServerUrl: ''}}));
        }
        // remove all inactive servers from server collection
        servers
          .filter(x => x.url !== this.serverUrl)
          .forEach(server => promises.push(this.pingAndRemoveServer(server)));
        return Promise.all(promises)
          .then(_serversToRemove => {
            const serversToRemove = _serversToRemove.filter(x => !!x); // will be undefined for ping success, so clear those out
            // remove inactive servers, and if primary jobs are set to their serverUrl, unset it
            return Promise.all([
              this.serverRepo.removeMany({_id: {$in: serversToRemove.map(x => x._id)}}),
              this.jobConfigRepo.updateMany({
                primary: true,
                primaryServerUrl: {$in: serversToRemove.map(x => x.url)}
              }, {$unset: {primaryServerUrl: ''}})
            ]);
          })
          .then(() => {
            // now that missing servers have been cleaned up, get them again and if no primary, set yourself to primary
            // it's possible 2 people do this at the same time, but startPrimareyJob's cleanup function will rectify that, choosing only the latest primary
            // then starting jobs (but only if primary server)
            return this.serverRepo.getMany({primary: true})
              .then(primaryServer => {
                const updateServer = thisServer.toObject() || new DfaServer();
                updateServer.updatedDate = new Date();
                if (!primaryServer) {
                  updateServer.primary = true;
                }
                this.serverRepo.upsertQueryOne({url: this.serverUrl}, updateServer, 'system', false, true);
              });
          });
      });

  }

  // return server if ping fails, else undefined
  pingAndRemoveServer(server: DfaServer) {
    shUtil.promiseChain(
      finRequest({url: `${server.url}/ping`})
    )
      .then(({resp, body}) => {
        if (resp.statusCode >= 400) {
          return server;
        }
      })
      .catch(err => {
        return server;
      });
  }

  // see if jobs are running on primary (job.primaryServerUrl set and primary exists), if not AND THIS IS PRIMARY, start them,
  // i.e. primary jobs can only can be started by the primary server
  startPrimaryJobsJob() {
    shUtil.promiseChain(this.cleanupJobCollection())
      .then(() => {
        // get primary jobs and if no primaryServerUrl AND THIS SERVER IS PRIMARY, START THE JOBS AND ADD THIS SERVERS SERVERURL
        Promise.all([
          this.serverRepo.getMany({primary: true}),
          this.getActiveJobConfigs({primary: true})
        ])
          .then(results => {
            const primaryServers = results[0];
            if (primaryServers.length === 0 || primaryServers.length > 1) {
              return; // let next run or primary determination clean things up to one primary
            }
            const primaryServer = primaryServers[0];
            if (primaryServer.url === this.serverUrl) {
              const primaryJobsNotRunning = results[1].filter(x => !x.primaryServerUrl);
              // start primary periodic jobs
              primaryJobsNotRunning.filter(x => x.period)
                .forEach(job => this.startPeriodicJob(job));
              primaryJobsNotRunning.filter(x => x.startTime)
                .forEach(job => this.runJob(job));
              // update primary jobs to this serverUrl
              return this.jobConfigRepo.updateMany({_id: {$in: [primaryJobsNotRunning.map(x => x._id)]}}, {$set: {primaryServerUrl: this.serverUrl}});
            }
          });
      })
      .catch(err => {
        throw new ApiError('jobManager.startPrimaryJobsJob error', svrUtil.getErrorForJson(err));
      });

  }

  // look for duplicate primaries and if found remove all but latest (primaryDetermination jobs could run at same time >> duplicate primaries),
  // then clean job.primaryServerUrls if they don't match the latest primary
  cleanupJobCollection() {
    const promises = [];
    let primaryServer;
    return Promise.all([
      this.serverRepo.getMany({primary: true}),
      this.getActiveJobConfigs()
    ])
      .then(results => {
        const primaryServers = results[0];
        const jobs = results[1];
        if (primaryServers.length > 1) {
          const primaryJobServerUrl = jobs.filter(x => x.primary).map(x => x.serverUrl)[0];
          primaryServer = _.find(primaryServers, {url: primaryJobServerUrl});
          if (primaryServer) {
          } else {
            primaryServer = _.orderBy(primaryServers, ['updatedDate'], ['desc'])[0];
          }
          promises.push(this.serverRepo.updateMany({_id: {$ne: primaryServer._id}}, {$set: {primary: false}}));
        }
        const removePrimaryForJobs = [];
        jobs.filter(x => x.primary && x.primaryServerUrl)
          .forEach(job => {
            if (job.primaryServerUrl !== primaryServer.url) {
              removePrimaryForJobs.push(job);
            }
          });
        if (removePrimaryForJobs.length) {
          promises.push(this.jobConfigRepo.updateMany({_id: {$in: removePrimaryForJobs.map(x => x._id)}}, {$unset: {primaryServerUrl: ''}}));
        }
        return Promise.all(promises);
      });
  }

  // checks startTime jobs (primary on primary server as well) for last run and start time, then runs and updates runtime in express app global or db???
  checkStartTimeJobsJob() {
    return Promise.resolve();
  }

  // periodic jobs (15 min or so) that copies mongo data to postgres
  databaseSyncJob(startup, syncMap?: SyncMap) {
    // can be called fron /api/rul-job (with syncMap then) or from periodic job (no syncMap, so syncs then)
    return Promise.resolve();
  }

  // startTime job that runs once a day to update cache after nightly data updates
  cacheRefreshJob() {
    const promises = []; // push all refreshes or... done somewhere else??
    Q.allSettled(promises)
      .then(results => handleQAllSettled(null, 'qAllReject'));
  }

  approvelEmailReminderJob() {
    Q.allSettled([
      this.submeasureController.approvalEmailReminder('submeasure'),
      this.ruleController.approvalEmailReminder('rule')
    ])
      .then(results => handleQAllSettled(null, 'qAllReject'));
  }

}







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
import {injectable} from 'inversify';
import DatabaseController from '../../api/database/controller';
import {ModuleRepo} from '../../api/common/module/repo';
import OpenPeriodRepo from '../../api/common/open-period/repo';
import {DfaJobFunction, DfaPeriodicJobInstance} from './models/job-misc';
import {DfaJobConfig} from './models/job-config';
import {DfaJobLog} from './models/job-log';
import {DfaJobRun} from './models/job-run';
import {DfaServer} from './models/job-server';
import {DisregardError} from '../common/disregard-error';


@injectable()
export class JobManager {
  serverHost: string;
  serverUrl: string;
  periodicJobInstances: DfaPeriodicJobInstance[] = [];
  jobConfigs: DfaJobConfig[];

  constructor(
    private jobConfigRepo: JobConfigRepo,
    private jobRunRepo: JobRunRepo,
    private jobLogRepo: JobLogRepo,
    private serverRepo: ServerRepo,
    private submeasureController: SubmeasureController,
    private ruleController: AllocationRuleController,
    private databaseController: DatabaseController
  ) {
  }

  serverStartup() {
    this.serverHost = app.get('serverHost');
    this.serverUrl = app.get('serverUrl');
    this.jobConfigRepo.getManyActive()
      .then(jobs => this.jobConfigs = jobs)
      // we need to run this initially before the startup jobs get going to clean out servers and runjobs, then startup jobs will re-add jobruns
      .then(() => this.cleanupServersAndJobRunMakePrimaryIfNoPrimaryJob(true))
      .then(() => {
        this.jobConfigs.filter(x => !x.primary && x.period)
          .forEach(job => this.startIntervalJob(job));
        this.jobConfigs.filter(x => !x.primary && x.runOnStartup)
          .forEach(job => this.runJob(job, true));
      });
  }

  startIntervalJob(job) {
    const timerId = setInterval(this.runJob.bind(this, job), job.period);
    this.periodicJobInstances.push({job: job, timerId});
  }

  getThisServer(): Promise<DfaServer> {
    return this.serverRepo.getMany()
      .then(servers => _.find(servers, {host: this.serverHost}));
  }

  setServerUploading(val) {
    this.getThisServer()
      .then(server => {
        server.uploading = val;
        return this.serverRepo.update(server, 'system', false);
      });
  }

  setServerSyncing(val) {
    this.getThisServer()
      .then(server => {
        server.syncing = val;
        return this.serverRepo.update(server, 'system', false);
      });
  }

  getJobFcnFromName(name): DfaJobFunction {
    let fcn;
    switch (name) {
      case 'approval-email-reminder':
        fcn = this.approvelEmailReminderPrimaryJob;
        break;
      case 'cache-refresh':
        fcn = this.cacheRefreshJob();
        break;
      case 'check-start-time-jobs':
        fcn = this.checkStartTimeJobsJob;
        break;
      case 'database-sync':
        fcn = this.databaseSyncPrimaryJob;
        break;
      case 'primary-placeholder':
        fcn = this.placeholderPrimaryJob;
        break;
      case 'server-and-jobrun-cleanup':
        fcn = this.cleanupServersAndJobRunMakePrimaryIfNoPrimaryJob;
        break;
      case 'start-primary-jobs':
        fcn = this.startPrimaryJobsJob();
        break;
    }
    return fcn;
  }

  runUpdate(run, req?) {
    run.userId = _.get(req, 'user.id') || 'system';
    return this.jobRunRepo.upsertMerge(run, run.userId, false);
  }

  log(run, message, req?) {
    run.userId = _.get(req, 'user.id') || 'system';
    if (_.find(this.jobConfigs, {name: run.jobName}).canLog) {
      const log = new DfaJobLog(run, message);
      return this.jobLogRepo.addOne(log, run.userId || log.userId || 'system', false);
    } else {
      return Promise.resolve();
    }
  }

  runUpdateAndLog(run, req, canLog, message) {
    return Promise.all([
      this.runUpdate(run, req),
      this.log(run, message)
    ])
      .then(results => results[0]); // return the job run
  }

  getJobRun(jobName) {
    return this.jobRunRepo.getOneByQuery({name: jobName, serverUrl: this.serverUrl});
  }

  runJob(job: DfaJobConfig, startup = false, data?, req?) {
    return Promise.all([
      this.getJobRun(job.name)
    ])
    // start
      .then(results => {
        if (typeof job === 'string') {
          const jobName = job;
          job = _.find(this.jobConfigs, {name: job});
        }
        const jobRun = <DfaJobRun>results[1] || new DfaJobRun({name: job.name, serverUrl: this.serverUrl});
        // /api/run-job calls with jobName
        // if running get out
        if (jobRun.running) {
          const log = <DfaJobRun>{
            serverHost: this.serverHost,
            jobName: job.name
          };
          return this.log(log, 'job already running');
        } else {
          delete jobRun.endDate;
          delete jobRun.duration;
          delete jobRun.status;
          jobRun.running = true;
          jobRun.startDate = new Date();
          return this.runUpdateAndLog(jobRun, req, job.canLog, 'job starting')
            .then(() => this.getJobFcnFromName(job.name)(startup, data, req))
            // job success
            .then(jobData => {
              return this.getJobRun(job.name)
                .then(run => {
                  run.running = false;
                  run.endDate = new Date();
                  run.duration = run.endDate.getTime() - run.startDate.getTime();
                  run.status = 'success';
                  run.data = jobData;
                  return this.runUpdateAndLog(run, req, job.canLog, 'job run successful'); // return the job run
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
                  run.status = 'failure';
                  run.error = err;
                  return this.runUpdateAndLog(run, req, job.canLog, 'job run error'); // return the job run
                });
            });
        }
      });
  }

  // ping all servers and update server jobRun collections, then becomes primary if none exists
  cleanupServersAndJobRunMakePrimaryIfNoPrimaryJob(startup) {
    const pingPromises = [];
    return this.serverRepo.getMany()
      .then(servers => {
        const thisServer = _.find(servers, {host: this.serverHost});
        servers.forEach(server => pingPromises.push(this.pingServer(server)));
        return Promise.all(pingPromises)
          .then(pings => {
            const serversToRemove = pings.filter(x => x);
            // remove all offline servers and their jobruns, and remove this server and jobruns if startup
            const promises = [
              this.serverRepo.removeMany({_id: {$in: serversToRemove.map(x => x._id)}}),
              this.jobRunRepo.removeMany({host: {$in: serversToRemove.map(x => x.host)}})
            ];
            // if startup, blow away this servers server entry and jobruns
            if (startup) {
              promises.push(this.jobRunRepo.removeMany({host: this.serverHost}));
            }
            return Promise.all(promises)
              .then(() => {
                // get latest servers and see if a primary exists, if not, set this server to primary, then add this server
                return this.serverRepo.getMany({primary: true})
                  .then(primary => {
                    const server = thisServer || <DfaServer>{
                      host: this.serverHost,
                      url: this.serverUrl
                    };
                    if (startup) {
                      server.startupDate = new Date();
                      delete server.syncing;
                      delete server.uploading;
                    }
                    if (!primary) {
                      server.primary = true;
                    }
                    return this.serverRepo.upsert(server, 'system', false);
                  });
              });
          });
      });
  }

// return server if ping fails, else undefined
  pingServer(server: DfaServer) {
    shUtil.promiseChain(finRequest({url: `${server.url}/ping`}))
      .then(({resp, body}) => {
        if (resp.statusCode >= 400) {
          return server;
        }
      })
      .catch(err => {
        return server;
      });
  }

  // look for primary servers, if none leave, if more than one, get it down to one
  // if THIS server is primary AND the jobs aren't running, start them
  startPrimaryJobsJob() {
    let primaryServer;
    const primaryJobNames = this.jobConfigs.filter(x => x.primary).map(x => x.name);
    return Promise.all([
      this.serverRepo.getMany({primary: true}),
      this.jobRunRepo.getMany({name: {$in: primaryJobNames}})
    ])
      .then(results => {
        const primaryServers = results[0];
        const primaryJobRuns = results[1];
        if (!primaryServers.length) {
          return Promise.reject(new DisregardError()); // wait for server-and-jobrun-cleanup to add one
        }
        const promises = [];
        // if more than one, get down to one or leave
        if (primaryServers.length > 1) {
          if (primaryJobRuns.length) {
            primaryServer = _.find(primaryServers, {host: primaryJobRuns[0].host});
            if (!primaryServer) {
              return Promise.reject(new DisregardError()); // wait for server-and-jobrun-cleanup to add one
            }
          } else {
            // grab newest one
            primaryServer = _.orderBy(primaryServers, ['updatedDate'], ['desc'])[0];
          }
          promises.push(this.serverRepo.updateMany({_id: {$ne: primaryServer._id}}, {$set: {primary: false}}));
        } else {
          primaryServer = primaryServers[0];
        }
        Promise.all(promises)
          .then(() => {
            // have just one primary server now

            // WE ONLY START PRIMARY JOBS ON THE PRIMARY SERVER
            // not primary server so leave
            if (primaryServer.host !== this.serverHost) {
              return;
            }
            // this is the primary server, check if jobs are already running, if not, start them
            if (primaryJobRuns.length && primaryServer.host === primaryJobRuns[0].host) {
              return; // already running, so leave
            } else {
              //  not running so start primary jobs
              this.jobConfigs.filter(x => x.primary && x.period)
                .forEach(job => this.startIntervalJob(job));
              this.jobConfigs.filter(x => x.primary && x.runOnStartup)
                .forEach(job => this.runJob(job, true));
            }
          });
      })
      .catch(err => {
        if (err instanceof DisregardError) {
          // we just used this error to get out of promise chain
        } else {
          return Promise.reject(err);
        }
      });
  }

  checkStartTimeJobsJob() {
    return Promise.all([
      this.serverRepo.getMany(),
      this.jobRunRepo.getMany()
    ])
      .then(results => {
        const server = _.find(results[0], {host: this.serverHost});
        const jobRuns = results[1];
        // check non-primary start time jobs
        this.jobConfigs.filter(x => x.startTime && !x.primary).forEach(startTimeJob => this.checkStartTimeAndRunJob(startTimeJob, server, jobRuns));

        // check primary jobs "if this server is primary" AND "if primary jobs are running on this server"
        const primaryJobNames = this.jobConfigs.filter(x => x.primary).map(x => x.name);
        const primaryJobRuns = jobRuns.filter(x => _.includes(primaryJobNames,  x.name));
        if (primaryJobRuns.length && this.serverHost === primaryJobRuns[0].host) {
          this.jobConfigs.filter(x => x.startTime && x.primary)
            .forEach(startTimeJob => this.checkStartTimeAndRunJob(startTimeJob, server, jobRuns));
        }
      });
  }

  /*
    given a comma separated list of 1-60m or 1-12am/pm, create a list of dates, then find the lastDate before now,
    but "only if it's withing 1 min or now". If found, and <= server.startupDate, get out
    else if no jobrun or jobrun.endDate < lastDate, run job
   */
  checkStartTimeAndRunJob(jobConfig: DfaJobConfig, server, jobRuns) {
    const jobRun = _.find(jobRuns, {jobName: jobConfig.name});
    if (jobRun && jobRun.running) {
      return;
    }

    let dates;
    if (/\d{1,2}m/.test(jobConfig.startTime)) {
      dates = jobConfig.startTime.split(/\d{1,2}m/)
        .map(x => Number(x.replace('m', '')))
        .map(minutes => {
          const date = new Date();
          date.setMinutes(minutes);
          return date;
        });

    } else if (/\d{1,2}(am|pm)/.test(jobConfig.startTime)) {
      dates = jobConfig.startTime.split(/\d{1,2}(am|pm)/)
        .map(x => {
          if (/am/.test(x)) {
            x.replace('am', '');
            return Number(x) - 1;
          } else if (/pm/.test(x)) {
            x.replace('pm', '');
            return Number(x) + 12 - 1;
          }
        })
        .sort()
        .map(hour => {
          const date = new Date();
          date.setHours(hour);
          return date;
        });
    }
    const msNow = Date.now();
    let lastDate;
    dates.forEach(date => {
      if (date.getTime() < msNow) {
        lastDate = date;
      }
    });
    // if lastDate and it's within a minute of now
    if (lastDate && msNow - lastDate.getTime() < 60 * 1000) {
      if (server.startupDate.getTime() >= lastDate.getTime()) {
        return;
      } else {
        if (!jobRun || jobRun.endDate.getTime() < lastDate.getTime()) {
          return this.runJob(jobConfig);
        }
      }
    }
  }

// periodic jobs (15 min or so) that copies mongo data to postgres
  databaseSyncPrimaryJob(startup, data ?, req ?) {
    // if (!req)  put this together. const req = _.set({}, 'dfa.fiscalMonths', ??);
    const userId = req.userId || 'system';
    const syncMap = data.syncMap ? data.syncMap : new SyncMap().setSyncAll();
    let dfa;
    if (!req) {
      return Promise.all([
        new ModuleRepo().getNonAdminSortedByDisplayOrder(),
        new OpenPeriodRepo().getMany()
      ]).then(results => {
        const modules = results[0];
        const openPeriods = results[1];
        modules.forEach(mod => {
          const openPeriod = _.find(openPeriods, {moduleId: mod.moduleId});
          mod.fiscalMonth = openPeriod && openPeriod.fiscalMonth;
        });
        const fiscalMonths: AnyObj = {};
        modules.forEach(mod => fiscalMonths[mod.abbrev] = mod.fiscalMonth);
        dfa = {};
        _.set(dfa, 'fiscalMonths', fiscalMonths);
      });
    } else {
      dfa = req.dfa;
    }
    return this.databaseController.mongoToPgSyncPromise(dfa, syncMap, userId);
  }

// startTime job that runs once a day to update cache after nightly data updates
  cacheRefreshJob() {
    const promises = []; // push all refreshes or... done somewhere else??
    Q.allSettled(promises)
      .then(results => handleQAllSettled(null, 'qAllReject'));
  }

  approvelEmailReminderPrimaryJob() {
    /*
        Q.allSettled([
          this.submeasureController.approvalEmailReminder('submeasure'),
          this.ruleController.approvalEmailReminder('rule')
        ])
          .then(results => handleQAllSettled(null, 'qAllReject'));
    */
    return Promise.resolve();
  }

  placeholderPrimaryJob() {
    // this job does nothing but indicate that primary jobs are running, and on what server.
    // We use the job runs to determine the primary server (if more than one), and if the primary jobs are running.
    // We must have a primary job in there to determine this, so this job is runOnStartup only and will always be there
    return Promise.resolve();
  }

}







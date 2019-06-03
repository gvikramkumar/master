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

class DfaJob {
  // properties
  id?: string;
  name: string;
  period?: number;
  startTime?: string;
  runOnStartup: boolean;
  primary: boolean;
  primaryServerUrl: string;
}

class DfaJobRunner {
  userId: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  active: boolean;
  status: string;
  data: AnyObj;
}

class DfaServer {
  id?: string;
  name: string;
  url: string;
  primary: boolean;
  updatedDate: Date;
}

export class JobManager {
  serverUrl: string;

  constructor(
    private jobRepo: JobConfigRepo,
    private serverRepo: ServerRepo,
    private submeasureController: SubmeasureController,
    private ruleController: AllocationRuleController
  ) {
  }

  serverStartup() {
    this.serverUrl = app.get('serverUrl');
    this.jobRepo.getMany({})
      .then(_jobs => {
        const nonPrimaryPeriodicJobs = _jobs.filter(x => !x.primary && x.period);
        const nonPrimaryStartupStartTimeJobs = _jobs.filter(x => !x.primary && x.startTime && x.runOnStartup);
        nonPrimaryPeriodicJobs.forEach(job => this.startPeriodicJob(job));
        nonPrimaryStartupStartTimeJobs.forEach(job => this.runStartTimeJob(job));
      });
  }

  getJobFcnFromName(name) {
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
  getRunJobFunction(job: DfaJob) {
    return ((data, startup) => {
      // do all that junk
      const fcn = this.getJobFcnFromName(job.name);
    }).bind(this);

  }

  startPeriodicJob(job: DfaJob) {
    setInterval(this.getRunJobFunction(job), job.period);
    if (job.runOnStartup) {
      this.getRunJobFunction(job)(null, true);
    }
  }

  runStartTimeJob(job: DfaJob) {
    const fcn = this.getJobFcnFromName(job.name);
    fcn(null, true);
  }

  primaryDeterminationJob(serverInit: boolean) {
    const promises = [];
    this.serverRepo.getMany()
      .then(servers => {
        const thisServer = _.find(servers, {name: this.serverUrl});
        if (serverInit && thisServer) {
          // remove yourself from primary jobs, all primary starts are done by startPrimaryJobs so we don't get duplicate primary jobs
          promises.push(this.jobRepo.updateMany({primary: true, primaryServerUrl: thisServer.url}, {$unset: {primaryServerUrl: ''}}));
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
              this.jobRepo.updateMany({
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
          this.jobRepo.getMany({primary: true})
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
              // update primary jobs to this serverUrl
              return this.jobRepo.updateMany({_id: {$in: [primaryJobsNotRunning.map(x => x._id)]}}, {$set: {primaryServerUrl: this.serverUrl}});
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
      this.jobRepo.getMany()
    ])
      .then(results => {
        const primaries = results[0];
        const jobs = results[1];
        if (primaries.length > 1) {
          const removePrimaryServers = _.orderBy(primaries, ['updatedDate'], ['desc']);
          primaryServer = removePrimaryServers.shift();
          promises.push(this.serverRepo.updateMany({_id: {$in: removePrimaryServers.map(x => x._id)}}, {$set: {primary: false}}));
        }
        const removePrimaryForJobs = [];
        jobs.filter(x => x.primary && x.primaryServerUrl)
          .forEach(job => {
            if (job.primaryServerUrl !== primaryServer.url) {
              removePrimaryForJobs.push(job);
            }
          });
        if (removePrimaryForJobs.length) {
          promises.push(this.jobRepo.updateMany({_id: {$in: removePrimaryForJobs.map(x => x._id)}}, {$unset: {primaryServerUrl: ''}}));
        }
        return Promise.all(promises);
      });
  }

  // checks startTime jobs (primary on primary server as well) for last run and start time, then runs and updates runtime in express app global or db???
  checkStartTimeJobsJob() {
  }

  // periodic jobs (15 min or so) that copies mongo data to postgres
  databaseSyncJob(syncMap) {

  }

  // startTime job that runs once a day to update cache after nightly data updates
  cacheRefreshJob() {
  }

  approvelEmailReminderJob() {
    this.submeasureController.approvalEmailReminder('submeasure');
    this.ruleController.approvalEmailReminder('rule');
  }

}







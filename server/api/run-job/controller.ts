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


type DfaJobFunction = (startup?: boolean, data?, req?) => Promise<any>;

interface DfaJob {
  displayName: string;
  lookupRunningKey: string;
  param: string;
  singleServer: boolean;
}

export const dfaJobs = [
  {name: 'databaseSync', dislayName: 'Database Sync', lookupKey: 'syncing', param: 'database-sync', singleServer: true},
  {name: 'approvalEmailReminder', dislayName: 'Approval Email Reminder', lookupKey: 'uploading', param: 'approval-email-reminder', singleServer: true}
]

@injectable()
export default class RunJobController {

  constructor(
    private jobLogRepo: JobLogRepo,
    private lookupRepo: LookupRepo,
    private submeasureController: SubmeasureController,
    private ruleController: AllocationRuleController,
    private databaseController: DatabaseController
  ) {

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

  log(log, req?) {
    log.userId = _.get(req, 'user.id') || 'system';
    return this.jobLogRepo.addOne(log, log.userId, false);
  }

  getJobFcnFromName(jobName): DfaJobFunction {
    let fcn;
    switch (jobName) {
      case 'approval-email-reminder':
        fcn = this.approvelEmailReminderJob.bind(this);
        break;
      case 'database-sync':
        fcn = this.databaseSyncJob.bind(this);
        break;
      default:
        throw new ApiError(`getJobFcnFromName: job not found: ${jobName}.`);
    }
    return fcn;
  }

  isDatabaseSyncJob(job) {
    return job.name === 'databaseSync';
  }

  isJobRunning(job: DfaJob) {
    return Promise.all([
      this.lookupRepo.getValues([job.lookupRunningKey, 'uploading']),
    ])
      .then(values => {
        const running = values[0];
        const uploading = values[1];
        if (running) {
          return `${job.displayName} job is already running.`;
        } else if (this.isDatabaseSyncJob(job) && uploading) {
          return `Upload in progress, please try again later.`;
        }
      });
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
          return this.log(log, req)
            .then(() => {
              Promise.reject(new ApiError (running));
            });
        }
      })
      .then(() => {
        return this.log(log, req)
          .then(() => {
            const jobFcn = this.getJobFcnFromName(jobName);
            return jobFcn(startup, data, req);
          })
          // job success
          .then(jobData => {
            log.endDate = new Date();
            log.duration = log.endDate.getTime() - log.startDate.getTime();
            log.status = 'success';
            log.data = jobData;
            return this.log(log, req);
          })
          // job error
          .catch(err => {
            log.endDate = new Date();
            log.duration = log.endDate.getTime() - log.startDate.getTime();
            log.status = 'error';
            log.error = err;
            return this.log(log, req)
              .then(logSaved => {
                throw new ApiError('Run job error', logSaved.toObject());
              });
          });
      });
  }

  databaseSyncJob(startup, data ?, req ?) {
    // if (!req)  put this together. const req = _.set({}, 'dfa.fiscalMonths', ??);
    const userId = req.userId || 'system';
    const syncMap = data.syncMap ? data.syncMap : new SyncMap().setSyncAll();
    return this.databaseController.mongoToPgSyncPromise(req.dfa, syncMap, userId);
  }

  approvelEmailReminderJob() {
    Q.allSettled([
      this.submeasureController.approvalEmailReminder('submeasure'),
      this.ruleController.approvalEmailReminder('rule')
    ])
      .then(results => handleQAllSettled(null, 'qAllReject'));
  }


}

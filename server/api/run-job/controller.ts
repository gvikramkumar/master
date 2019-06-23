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


type DfaJobFunction = (startup?: boolean, data?, req?) => Promise<any>;

@injectable()
export default class RunJobController {

  constructor(
    private jobLogRepo: JobLogRepo,
    private submeasureController: SubmeasureController,
    private ruleController: AllocationRuleController,
    private databaseController: DatabaseController
  ) {

  }

  test() {
    return 'lala';
  }

  runJobAndRespond(req, res, next) {
    const jobName = req.params['jobName'];
    Promise.resolve()
      .then(() => {
        return this.runJob(jobName, false, req.body || req.query, req);
      })
      .then(jobRun => res.json(jobRun))
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
        fcn = this.approvelEmailReminderPrimaryJob;
        break;
      case 'database-sync':
        fcn = this.databaseSyncPrimaryJob;
        break;
      default:
        throw new ApiError(`getJobFcnFromName: job not found: ${jobName}.`);
    }
    return fcn;
  }

  runJob(jobName, startup = false, data?, req?) {
    const jobFcn = this.getJobFcnFromName(jobName);
    const log = <DfaJobLog>{
      host: _.get(global, 'dfa.serverHost'),
      jobName,
      startDate: new Date(),
      data,
      status: 'starting'
    };
    return this.log(log, req)
      .then(() => jobFcn(startup, data, req))
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
        log.status = 'success';
        log.error = err;
        return this.log(log, req);
      });
  }

  databaseSyncPrimaryJob(startup, data ?, req ?) {
    // if (!req)  put this together. const req = _.set({}, 'dfa.fiscalMonths', ??);
    const userId = req.userId || 'system';
    const syncMap = data.syncMap ? data.syncMap : new SyncMap().setSyncAll();
    return this.databaseController.mongoToPgSyncPromise(req.dfa, syncMap, userId);
  }

  approvelEmailReminderPrimaryJob() {
    Q.allSettled([
      this.submeasureController.approvalEmailReminder('submeasure'),
      this.ruleController.approvalEmailReminder('rule')
    ])
      .then(results => handleQAllSettled(null, 'qAllReject'));
  }


}

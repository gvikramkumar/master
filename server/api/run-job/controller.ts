import {injectable} from 'inversify';
import JobLogRepo from '../../lib/job/job-log-repo';
import SubmeasureController from '../common/submeasure/controller';
import {injector} from '../../lib/common/inversify.config';
import AllocationRuleController from '../common/allocation-rule/controller';
import moment from 'moment';
import {svrUtil} from '../../lib/common/svr-util';

@injectable()
export default class RunJobController {
  constructor(private repo: JobLogRepo) {
  }

  runJob(req, res, next) {
    const jobName = req.params['jobName'];
    const promises = [];
    const startDate = new Date();
    switch (jobName) {
      case 'approval-email-reminder':
        promises.push(
          injector.get(SubmeasureController).approvalEmailReminder('submeasure'),
          injector.get(AllocationRuleController).approvalEmailReminder('rule')
        );
        break;
      case 'database-sync':
        break;
      default:
        return res.status(400).json({error: `Api called with invalid job name: ${jobName}`});
    }
    Promise.resolve()
      .then(() => {
        return Promise.all(promises);
      })
      .then(results => {
        const status = 'success';
        const message = results.join(', ');
        const data = this.getResultObject(jobName, req.user.id, status, startDate, message);
        this.repo.addOne(data, req.user.id)
          .then(() => {
            res.json(data);
          });
      })
      .catch(err => {
        const status = 'failure';
        const errorObject = svrUtil.getErrorForJson(err);
        const data = this.getResultObject(jobName, req.user.id, status, startDate, errorObject);
        this.repo.addOne(data, req.user.id)
          .then(() => res.json(data));
      });
  }

  getResultObject(jobName, userId, status, startDate, data) {
    let endDate;
    endDate = new Date();
    const duration = moment.duration(endDate - startDate);
    const durationString = duration.seconds() > 60 ? `${duration.minutes()} minutes` : `${duration.seconds()} seconds`;
    return {
      jobName,
      userId,
      status,
      startDate,
      endDate,
      duration: durationString,
      data
    };
  }
}

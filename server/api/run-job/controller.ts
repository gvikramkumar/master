import {injectable} from 'inversify';
import JobLogRepo from '../../lib/job/job-log-repo';
import {JobManager} from '../../lib/job/job-manager';

@injectable()
export default class RunJobController {
  constructor(private repo: JobLogRepo, private jobManager: JobManager) {
  }

  runJob(req, res, next) {
    const jobName = req.params['jobName'];
    Promise.resolve()
      .then(() => {
        return this.jobManager.runJob(jobName, false, req.body || req.query, req);
      })
      .then(data => res.json(data))
      .catch(next);
  }

}

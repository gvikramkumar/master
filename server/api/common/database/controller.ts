import {injectable} from 'inversify';
import MeasureController from '../measure/controller';
import {ModuleSourceController} from '../module-source/controller';
import ModuleController from '../module/controller';
import {OpenPeriodController} from '../open-period/controller';
import SubmeasureController from '../submeasure/controller';
import DeptUploadController from '../../prof/dept-upload/controller';
import MappingUploadController from '../../prof/mapping-upload/controller';
import DollarUploadController from '../../prof/dollar-upload/controller';


@injectable()
export default class DatabaseController {
  constructor(
    private measureCtrl: MeasureController,
    private moduleCtrl: ModuleController,
    private moduleSourceCtrl: ModuleSourceController,
    private openPeriodCtrl: OpenPeriodController,
    private submeasureCtrl: SubmeasureController,
    private deptUploadCtrl: DeptUploadController,
    private dollarUploadCtrl: DollarUploadController,
    private mappingUploadCtrl: MappingUploadController,
    ) {
  }

  mongoToPgSync(req, res, next) {
    const log: string[] = [];
    Promise.all([
      this.measureCtrl.mongoToPgSync('dfa_measure', req.user.id, log),
      this.moduleCtrl.mongoToPgSync('dfa_module', req.user.id, log),
      this.moduleSourceCtrl.mongoToPgSync(req.user.id, log),
      this.openPeriodCtrl.mongoToPgSync('dfa_open_period', req.user.id, log),
      this.deptUploadCtrl.mongoToPgSync('dfa_prof_dept_acct_map_upld', req.user.id, log),
      this.dollarUploadCtrl.mongoToPgSync('dfa_prof_input_amnt_upld', req.user.id, log),
      this.mappingUploadCtrl.mongoToPgSync('dfa_prof_manual_map_upld', req.user.id, log),
      this.submeasureCtrl.mongoToPgSync('dfa_sub_measure', req.user.id, log),
      this.submeasureCtrl.mongoToPgSyncFilterLevel(req.user.id, log),
    ])
      .then(() => res.json(log.join('\n')))
      .catch(next); // shouldn't happen as all methods are to log and ignore errors
  }

  pgToMongoSync(req, res, next) {
    return this.submeasureCtrl.pgToMongoSync(req, res, next);
  }

}


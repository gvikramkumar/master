import {injectable} from 'inversify';
import MeasureController from '../common/measure/controller';
import ModuleController from '../common/module/controller';
import {OpenPeriodController} from '../common/open-period/controller';
import SubmeasureController from '../common/submeasure/controller';
import DeptUploadController from '../prof/dept-upload/controller';
import MappingUploadController from '../prof/mapping-upload/controller';
import DollarUploadController from '../prof/dollar-upload/controller';
import {ApiError} from '../../lib/common/api-error';
import {ModuleSourceController} from '../common/module-source/controller';


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
    const resultArr = [];
    const log: string[] = [];
    const elog: string[] = [];
    Promise.all([
      // this.moduleSourceCtrl.mongoToPgSync('dfa_data_sources', req.user.id, log, elog),
      // this.measureCtrl.mongoToPgSync('dfa_measure', req.user.id, log, elog),
      // this.moduleCtrl.mongoToPgSync('dfa_module', req.user.id, log, elog),
      // this.openPeriodCtrl.mongoToPgSync('dfa_open_period', req.user.id, log, elog),
      this.deptUploadCtrl.mongoToPgSync('dfa_prof_dept_acct_map_upld', req.user.id, log, elog),
      // this.dollarUploadCtrl.mongoToPgSync('dfa_prof_input_amnt_upld', req.user.id, log, elog),
      // this.mappingUploadCtrl.mongoToPgSync('dfa_prof_manual_map_upld', req.user.id, log, elog),
      // this.submeasureCtrl.mongoToPgSync('dfa_sub_measure', req.user.id, log, elog),
    ])
      .then(() => {
        if (elog.length) {
          next(new ApiError('MongoToPgSync Errors', {success: log, errors: elog}));
        } else {
          res.json({success: log});
        }
      })
      .catch(err => {
        const data = {success: log, errors: elog};
        next(Object.assign(err, data));
        return;
        // this is how we'd not stop for errors (below) along with try/catch in controllerBase.mongoToPgSync()
        // but if we do this, we don't get stack trace from error. Need that stack trace to find the issue
        // albeit the try/catch method will show us all the records having issues, not stopping on the first one
        // so both are useful, the above for debugging code and below for debugging data. You'd need to log and ignore
        // errors to debug the data, not just jump out on first failure.
        // next(new ApiError('MongoToPgSync Errors', data));
      });
  }

  pgToMongoSync(req, res, next) {
    const resultArr = [];
    const log: string[] = [];
    const elog: string[] = [];
    Promise.all([
      this.submeasureCtrl.pgToMongoSync(req.user.id, log, elog)
    ])
      .then(() => {
        if (elog.length) {
          next(new ApiError('PgToMongoSync Errors', {success: log, errors: elog}));
        } else {
          res.json({success: log});
        }
      })
      .catch(err => {
        next(err);
        return;
        elog.push(err.message);
        next(new ApiError('PgToMongoSync Errors', {success: log, errors: elog, err}));
      });
  }



}


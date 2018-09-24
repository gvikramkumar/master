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
import ProductClassUploadController from '../prof/product-class-upload/controller';
import SalesSplitUploadController from '../prof/sales-split-upload/controller';
import OpenPeriodRepo from '../common/open-period/repo';
import {DfaModuleIds} from '../../../shared/enums';
import * as _ from 'lodash';
import {shUtil} from '../../../shared/shared-util';

@injectable()
export default class DatabaseController {
  constructor(
    private openPeriodRepo: OpenPeriodRepo,
    private measureCtrl: MeasureController,
    private moduleCtrl: ModuleController,
    private moduleSourceCtrl: ModuleSourceController,
    private openPeriodCtrl: OpenPeriodController,
    private submeasureCtrl: SubmeasureController,
    private deptUploadCtrl: DeptUploadController,
    private dollarUploadCtrl: DollarUploadController,
    private mappingUploadCtrl: MappingUploadController,
    private productClassUploadCtrl: ProductClassUploadController,
    private salesSplitUploadCtrl: SalesSplitUploadController
    ) {
  }

  mongoToPgSync(req, res, next) {
    let openPeriods: {moduleId: number, fiscalMonth: number}[];
    const curFiscalMonth = shUtil.getFiscalMonthListFromDate(new Date(), 1)[0].fiscalMonth;
    const resultArr = [];
    const log: string[] = [];
    const elog: string[] = [];
    Promise.all([
      this.openPeriodRepo.getMany()
    ])
      .then(results => {
        openPeriods = results[0];
        openPeriods.forEach(op => {
          if (op.fiscalMonth !== curFiscalMonth) {
            throw new ApiError('Some modules not set to current fiscal month', null, 400);
          }
        });
      })
      .then(() => {
        Promise.all([
          // common
          this.moduleSourceCtrl.mongoToPgSync('dfa_data_sources', req.user.id, log, elog),
          this.measureCtrl.mongoToPgSync('dfa_measure', req.user.id, log, elog, {moduleId: -1}),
          this.moduleCtrl.mongoToPgSync('dfa_module', req.user.id, log, elog),
          this.openPeriodCtrl.mongoToPgSync('dfa_open_period', req.user.id, log, elog),
          this.submeasureCtrl.mongoToPgSync('dfa_sub_measure', req.user.id, log, elog, {moduleId: -1}),
          // prof
          this.deptUploadCtrl.mongoToPgSync('dfa_prof_dept_acct_map_upld', req.user.id, log, elog), // deletes all on upload and pgsync
          this.dollarUploadCtrl.mongoToPgSync('dfa_prof_input_amnt_upld', req.user.id, log, elog, {}, {fiscalMonth: curFiscalMonth}),
          this.mappingUploadCtrl.mongoToPgSync('dfa_prof_manual_map_upld', req.user.id, log, elog,
            {fiscalMonth: curFiscalMonth}, {fiscalMonth: curFiscalMonth}),
          this.productClassUploadCtrl.mongoToPgSync('dfa_prof_swalloc_manualmix_upld', req.user.id, log, elog,
            {fiscalMonth: curFiscalMonth}, {fiscalMonth: curFiscalMonth}),
          this.salesSplitUploadCtrl.mongoToPgSync('dfa_prof_sales_split_pctmap_upld', req.user.id, log, elog,
            {fiscalMonth: curFiscalMonth}, {fiscalMonth: curFiscalMonth}),
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
      })
      .catch(next);
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


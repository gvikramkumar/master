import {inject, injectable, LazyServiceIdentifer} from 'inversify';
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
import {shUtil} from '../../../shared/misc/shared-util';
import {SyncMap} from '../../../shared/models/sync-map';
import SubmeasureRepo from '../common/submeasure/repo';
import AlternateSl2UploadController from '../prof/alternate-sl2-upload/controller';
import CorpAdjustmentsUploadController from '../prof/corp-adjustments-upload/controller';
import {ApiDfaData} from '../../lib/middleware/add-global-data';
import DistiDirectUploadController from '../prof/disti-direct-upload/controller';
import ServiceMapUploadController from '../prof/service-map-upload/controller';
import ServiceTrainingUploadController from '../prof/service-training-upload/controller';
import {svrUtil} from '../../lib/common/svr-util';
import {handleQAllSettled} from '../../lib/common/q-allSettled';
import Q from 'q';
import {app} from '../../express-setup';
import config from '../../config/get-config';

@injectable()
export default class DatabaseController {
  constructor(
    private openPeriodRepo: OpenPeriodRepo,
    private submeasureRepo: SubmeasureRepo,
    private measureCtrl: MeasureController,
    private moduleCtrl: ModuleController,
    private moduleSourceCtrl: ModuleSourceController,
    private openPeriodCtrl: OpenPeriodController,
    // needed to get past circular ref injection error, message was: "missing required @inject or @multiInject annotation"
    // when trying to injector.get(DatabaseController) in submeasureController. The formal circular reference obtained when both
    // were injecting each other. Tried @lazyInject, but it appeared to do nothing as submeasureCtrl was null in database controller,
    // tried this line in submeasureController, but got circular reference as well. Only thing that worked was injector.get in the
    // submeasureController method (postApproveStep). Surely injector.get used in all methods probabably would have worked?? ... yes
    // but this is better, at least one has a class wide value
    @inject(new LazyServiceIdentifer(() => SubmeasureController)) private submeasureCtrl: SubmeasureController,
    private deptUploadCtrl: DeptUploadController,
    private dollarUploadCtrl: DollarUploadController,
    private mappingUploadCtrl: MappingUploadController,
    private productClassUploadCtrl: ProductClassUploadController,
    private salesSplitUploadCtrl: SalesSplitUploadController,
    private alternateSl2UploadCtrl: AlternateSl2UploadController,
    private corpAdjustmentsUploadCtrl: CorpAdjustmentsUploadController,
    private distiDirectUploadController: DistiDirectUploadController,
    private serviceMapUploadController: ServiceMapUploadController,
    private serviceTrainingUploadController: ServiceTrainingUploadController
  ) {
  }

  mongoToPgSyncPromise(dfa: ApiDfaData, syncMap: SyncMap, userId: string) {
    const resultArr = [];
    const log: string[] = [];
    const elog: string[] = [];
    const promises = [];

    // this is to make sure we don't accidentally sync to dev/stage pg with local mongo database, use ldev env to sync to local postgres
    if (svrUtil.isLocalEnv() && config.postgres.host !== 'localhost') {
      throw new ApiError('Syncing local mongo to non-local postgres.');
    }

    if (app.get('syncing')) {
      throw new ApiError('Database sync is already running.');
    }

    app.set('syncing', true);

    if (syncMap.dfa_data_sources) {
      promises.push(this.moduleSourceCtrl.mongoToPgSync('dfa_data_sources', userId, log, elog));
    }
    if (syncMap.dfa_measure) {
      promises.push(this.measureCtrl.mongoToPgSync('dfa_measure', userId, log, elog, {moduleId: -1}));
    }
    if (syncMap.dfa_module) {
      promises.push(this.moduleCtrl.mongoToPgSync('dfa_module', userId, log, elog, {abbrev: {$ne: 'admn'}}));
    }
    if (syncMap.dfa_open_period) {
      promises.push(this.openPeriodCtrl.mongoToPgSync('dfa_open_period', userId, log, elog));
    }
    if (syncMap.dfa_sub_measure) {
      promises.push(this.submeasureCtrl.mongoToPgSync('dfa_sub_measure', userId, log, elog,
        this.submeasureRepo.getManyLatestGroupByNameActiveInactive(-1)));
    }
    if (syncMap.dfa_prof_dept_acct_map_upld) {
      promises.push(this.deptUploadCtrl.mongoToPgSync('dfa_prof_dept_acct_map_upld', userId, log, elog,
        {temp: 'N'})); // deletes all on pgsync
    }
    if (syncMap.dfa_prof_input_amnt_upld) {
      promises.push(this.dollarUploadCtrl.mongoToPgSync('dfa_prof_input_amnt_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, {fiscalMonth: dfa.fiscalMonths.prof}));
    }
    if (syncMap.dfa_prof_manual_map_upld) {
      promises.push(this.mappingUploadCtrl.mongoToPgSync('dfa_prof_manual_map_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, undefined, dfa));
    }
    if (syncMap.dfa_prof_scms_triang_altsl2_map_upld) {
      promises.push(this.alternateSl2UploadCtrl.mongoToPgSync('dfa_prof_scms_triang_altsl2_map_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, {fiscalMonth: dfa.fiscalMonths.prof}));
    }
    if (syncMap.dfa_prof_scms_triang_corpadj_map_upld) {
      promises.push(this.corpAdjustmentsUploadCtrl.mongoToPgSync('dfa_prof_scms_triang_corpadj_map_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, {fiscalMonth: dfa.fiscalMonths.prof}));
    }
    if (syncMap.dfa_prof_swalloc_manualmix_upld) {
      promises.push(this.productClassUploadCtrl.mongoToPgSync('dfa_prof_swalloc_manualmix_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, undefined, dfa));
    }
    if (syncMap.dfa_prof_sales_split_pctmap_upld) {
      promises.push(this.salesSplitUploadCtrl.mongoToPgSync('dfa_prof_sales_split_pctmap_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, {fiscalMonth: dfa.fiscalMonths.prof}, dfa));
    }
    if (syncMap.dfa_prof_disti_to_direct_map_upld) {
      promises.push(this.distiDirectUploadController.mongoToPgSync('dfa_prof_disti_to_direct_map_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, {fiscalMonth: dfa.fiscalMonths.prof}, dfa));
    }
    if (syncMap.dfa_prof_service_map_upld) {
      promises.push(this.serviceMapUploadController.mongoToPgSync('dfa_prof_service_map_upld', userId, log, elog,
        {fiscalMonth: dfa.fiscalMonths.prof}, {fiscalMonth: dfa.fiscalMonths.prof}));
    }
    if (syncMap.dfa_prof_service_trngsplit_pctmap_upld) {
      const fiscalYear = shUtil.fiscalYearFromFiscalMonth(dfa.fiscalMonths.prof);
      promises.push(this.serviceTrainingUploadController.mongoToPgSync('dfa_prof_service_trngsplit_pctmap_upld', userId, log, elog,
        {fiscalYear}, {fiscalYear}));
    }

    return Promise.resolve() // must be in "then()" to catch thrown errors, use shUtil.promiseChain when merged in
      .then(() => {
        return Q.allSettled(promises)
          .then(handleQAllSettled(null, 'qAllReject'))
          .then(results => {
            app.set('syncing', false);
            if (elog.length) {
              throw new Error('handled in catch');
              return;
            }
            return log;
          })
          .catch(err => {
            app.set('syncing', false);
            throw new ApiError('MongoToPgSync Errors.', {success: log, errors: elog});
          });
      });
  }

  mongoToPgSync(req, res, next) {
    const syncMap = req.body && Object.keys(req.body).length ? new SyncMap(req.body) : new SyncMap().setSyncAll();

    this.mongoToPgSyncPromise(req.dfa, syncMap, req.user.id)
      .then(log => {
        res.json({success: log});
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
          next(new ApiError('PgToMongoSync Errors.', {success: log, errors: elog}));
        } else {
          res.json({success: log});
        }
      })
      .catch(err => {
        next(err);
        return;
        elog.push(err.message);
        next(new ApiError('PgToMongoSync Errors.', {success: log, errors: elog, err}));
      });
  }

}


import LookupRepo from '../../api/lookup/repo';
import {ModuleRepo} from '../../api/common/module/repo';
import _ from 'lodash';
import AnyObj from '../../../shared/models/any-obj';
import {DfaModule} from '../../../ui/src/app/modules/_common/models/module';
import DfaUser from '../../../shared/models/dfa-user';
import {ApiError} from '../common/api-error';
import {IncomingMessage} from 'http';
import OpenPeriodRepo from '../../api/common/open-period/repo';
import {svrUtil} from '../common/svr-util';

export class ApiDfaData {
  _module?: DfaModule;
  modules: DfaModule[];
  fiscalMonths: AnyObj;
  _itadminEmail: string;
  _dfaAdminEmail: string;
  _bizAdminEmail: string;
  _ppmtEmail: string;
  user: DfaUser;
  req: IncomingMessage;

  constructor(data) {
    Object.assign(this, data);
  }

  get module() {
    if (!this._module) {
      throw new ApiError(`dfaData.module doesn't exist.`);
    }
    return this._module;
  }
  set module(module) {
    this._module = module;
  }

  get moduleId() {
    return this.module.moduleId;
  }

  get itadminEmail() {
    return svrUtil.getEnvEmail(this._itadminEmail);
  }

  set itadminEmail(email) {
    this._itadminEmail = email;
  }

  get dfaAdminEmail() {
    return svrUtil.getEnvEmail(this._dfaAdminEmail);
  }

  set dfaAdminEmail(email) {
    this._dfaAdminEmail = email;
  }

  get bizAdminEmail() {
    return svrUtil.getEnvEmail(this._bizAdminEmail);
  }

  set bizAdminEmail(email) {
    this._bizAdminEmail = email;
  }

  get ppmtEmail() {
    return svrUtil.getEnvEmail(this._ppmtEmail);
  }

  set ppmtEmail(email) {
    this._ppmtEmail = email;
  }

}

const lookupRepo = new LookupRepo();
const moduleRepo = new ModuleRepo();
const openPeriodRepo = new OpenPeriodRepo();

export function addGlobalData() {

  return function (req, res, next) {
    Promise.all([
      lookupRepo.getValues(['itadmin-email', 'dfa-admin-email', 'dfa-biz-admin-email', 'ppmt-email']),
      moduleRepo.getNonAdminSortedByDisplayOrder(),
      openPeriodRepo.getMany()
    ])
      .then(results => {
        const lookups = results[0];
        const modules = results[1];
        const openPeriods = results[2];
        modules.forEach(mod => {
          const openPeriod = _.find(openPeriods, {moduleId: mod.moduleId});
          mod.fiscalMonth = openPeriod && openPeriod.fiscalMonth;
        });
        const fiscalMonths: AnyObj = {};
        modules.forEach(mod => fiscalMonths[mod.abbrev] = mod.fiscalMonth);
         const dfa = new ApiDfaData({
          req: req,
          user: req.user,
          itadminEmail: lookups[0],
          dfaAdminEmail: lookups[1],
          bizAdminEmail: lookups[2],
          ppmtEmail: lookups[3],
          modules,
          fiscalMonths
        });
        const moduleId = req.query.moduleId || req.body.moduleId;
        if (moduleId) {
          // this is where the moduleId is set for DfaUser
          req.user.moduleId = moduleId;
          dfa.module = _.find(modules, {moduleId: Number(moduleId)});
        }
        req.dfa = dfa;
        next();
      })
      .catch(next);


  };

}

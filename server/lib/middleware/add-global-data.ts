import LookupRepo from '../../api/lookup/repo';
import {ModuleRepo} from '../../api/common/module/repo';
import _ from 'lodash';
import AnyObj from '../../../shared/models/any-obj';
import {DfaModule} from '../../../ui/src/app/modules/_common/models/module';
import DfaUser from '../../../shared/models/dfa-user';
import {ApiError} from '../common/api-error';
import {IncomingMessage} from 'http';
import OpenPeriodRepo from '../../api/common/open-period/repo';

export class ApiDfaData {
  _module?: DfaModule;
  modules: DfaModule[];
  fiscalMonths: AnyObj;
  itadminEmail: string;
  ppmtEmail: string;
  user: DfaUser;
  req: IncomingMessage

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

}

const lookupRepo = new LookupRepo();
const moduleRepo = new ModuleRepo();
const openPeriodRepo = new OpenPeriodRepo();

export function addGlobalData() {

  return function (req, res, next) {
    Promise.all([
      lookupRepo.getValues(['itadmin-email', 'ppmt-email']),
      moduleRepo.getNonAdminSortedByDisplayOrder(),
      openPeriodRepo.getMany()
    ])
      .then(results => {
        const lookups = results[0];
        const modules = results[1];
        const openPeriods = results[2];
        modules.forEach(mod => mod.fiscalMonth = _.find(openPeriods, {moduleId: mod.moduleId}).fiscalMonth);
        const fiscalMonths: AnyObj = {};
        modules.forEach(mod => fiscalMonths[mod.abbrev] = mod.fiscalMonth);

        const dfa = new ApiDfaData({
          req: req,
          user: req.user,
          itadminEmail: lookups[0],
          ppmtEmail: lookups[1],
          modules,
          fiscalMonths
        });
        if (req.query.moduleId || req.body.moduleId) {
          dfa.module = _.find(modules, {moduleId: Number(req.query.moduleId || req.body.moduleId)});
        }
        req.dfa = dfa;
        next();
      })
      .catch(next);


  };

}

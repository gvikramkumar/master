import {injectable} from 'inversify';
import ControllerBase from '../../../lib/base-classes/controller-base';
import {ModuleRepo} from './repo';
import {ModulePgRepo} from './pgrepo';
import OpenPeriodRepo from '../open-period/repo';
import { shUtil } from '../../../../shared/misc/shared-util';

@injectable()
export default class ModuleController extends ControllerBase {
  constructor(protected repo: ModuleRepo, pgRepo: ModulePgRepo, private openPeriodRepo: OpenPeriodRepo) {
    super(repo, pgRepo);
  }

  addOne(req, res, next) {
    this.addOnePromise(req, res, next)
      .then(item => {
        if (item.status === 'A') {
         this.addOpenPeriod(item.moduleId, req.user.id)
            .then(() => res.json(item));
        } else {
          res.json(item);
        }
      })
      .catch(next);
  }

  update(req, res, next) {
    const data = req.body;
    this.updatePromise(req, res, next)
      .then(item => {
        const promises = [];
        if (item.status === 'A') {
          promises.push(this.addOpenPeriod(data.moduleId, req.user.id));
        } else {
          promises.push(this.removeOpenPeriod(data.moduleId));
        }
        Promise.all(promises)
          .then(() => res.json(item));
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.removeOnePromise(req, res, next)
      .then(item => {
        if (item.status === 'A') {
          this.removeOpenPeriod(item.moduleId)
            .then(() => res.json(item));
        } else {
          res.json(item);
        }
      })
      .catch(next);
  }

  addOpenPeriod(moduleId, userId) {
    const yearmos = shUtil.getFiscalMonthListFromDate(new Date, 1);
    const latestfiscalMonth = yearmos[0].fiscalMonth;
    const data = {
      moduleId,
      fiscalMonth: latestfiscalMonth,
      openFlag: 'Y'
    };
    return this.openPeriodRepo.addOne(data, userId);
  }

  removeOpenPeriod(moduleId) {
   return this.openPeriodRepo.removeQueryOne({moduleId}, false);
  }

  getActiveSortedByDisplayOrder(req, res, next) {
    this.repo.getActiveSortedByDisplayOrder()
      .then(docs => res.json(docs))
      .catch(next);
  }

  getNonAdminSortedByDisplayOrder(req, res, next) {
    this.repo.getNonAdminSortedByDisplayOrder()
      .then(docs => res.json(docs))
      .catch(next);
  }

}


import {ApiError} from '../common/api-error';
import _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import RepoBase from './repo-base';
import {PgRepoBase} from './pg-repo-base';
import AnyObj from '../../../shared/models/any-obj';
import {ApiDfaData} from '../middleware/add-global-data';
import {shUtil} from '../../../shared/misc/shared-util';

export default class ControllerBase {
  isMirrorRepo = false; // set if you're writing to mongo and pg at same time (we sync daily now so not used currently)

  constructor(protected repo: RepoBase, protected pgRepo?: PgRepoBase) {
  }

  // GetMany special query parameters
  // params get sent in as queryString and become mongo find(filter)
  // other values used to determine query type get pulled out before filtering

  // setYearmo:
  // eg: 201809, this will filter data to updatedDate within that date range, if upperOnly=true
  // then only filters using the upper date of that range. The uploads have fiscalMonth so best done using
  // fiscalMonth for those, it will be indexed.

  // setSkip, setLimit, setSort:
  // support paging

  // getDistinct=someField:
  // gets distinct values for that field after filtering

  // groupField=someField:
  // groups by this field after filtering, then selects latest of each group. This is used to get
  // current rules grouping by name. If setYearmo and upperOnly used, can get current rules for any fiscal month

  // getLatest=true:
  // filters then picks latest value (only returns one value) using updatedDate

  // we have this functionality required in other api classes, so pull it out of
  // controller's getMany to reuse
  getManyPromise(req) {
    let promise;
    if (req.query.groupField) {
      promise = this.repo.getManyByGroupLatest(req.query);
    } else if (req.query.getLatest) {
      promise = this.repo.getOneLatest(req.query);
    } else {
      promise = this.repo.getMany(req.query);
    }
    return promise;
  }

  // get /
  getMany(req, res, next) {
    this.getManyPromise(req)
      .then(items => res.json(items))
      .catch(next);
  }

  // get /query-one
  getQueryOne(req, res, next) {
    const setNoError = req.query.setNoError;
    delete req.query.setNoError;
    this.repo.getOneByQuery(req.query)
      .then(item => {
        if (item) {
          res.json(item);
        } else if (setNoError) {
          res.status(204).end();
        } else {
          next(new ApiError('Not found.', null, 404));
        }
      })
      .catch(next);
  }

  // ui will always add error modal on 404, we'll allow a querystring "setNoError" to defeat this
  // get /:id
  getOne(req, res, next) {
    this.repo.getOneById(req.params.id)
      .then(item => {
        if (item) {
          res.json(item);
        } else if (req.query.setNoError) {
          res.status(204).end();
        } else {
          next(new ApiError('Not found.', null, 404));
        }
      })
      .catch(next);
  }

  // post /
  addOnePromise(req, res, next) {
    const data = req.body;
    return this.repo.addOne(data, req.user.id)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          return this.pgRepo.addOne(_.clone(item), req.user.id)
            .then(() => item);
        } else {
          return item;
        }
      });
  }

  addOne(req, res, next) {
    this.addOnePromise(req, res, next)
      .then(item => res.json(item))
      .catch(next);
  }

  addOneNoValidatePromise(req, res, next) {
    const data = req.body;
    return this.repo.addOne(data, req.user.id, false)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          return this.pgRepo.addOne(_.clone(item), req.user.id)
            .then(() => item);
        } else {
          return item;
        }
      });
  }

  addOneNoValidate(req, res, next) {
    this.addOneNoValidatePromise(req, res, next)
      .then(item => res.json(item))
      .catch(next);
  }

  copyOnePromise(req, res, next) {
    const data = req.body;
    return this.repo.copyOne(data, req.user.id)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          return this.pgRepo.addOne(_.clone(item), req.user.id)
            .then(() => item);
        } else {
          return item;
        }
      });
  }

  copyOne(req, res, next) {
    this.copyOnePromise(req, res, next)
      .then(item => res.json(item))
      .catch(next);
  }

  copyOneNoValidatePromise(req, res, next) {
    const data = req.body;
    return this.repo.copyOne(data, req.user.id, false)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          return this.pgRepo.addOne(_.clone(item), req.user.id)
            .then(() => item);
        } else {
          return item;
        }
      });
  }

  copyOneNoValidate(req, res, next) {
    this.copyOneNoValidatePromise(req, res, next)
      .then(item => res.json(item))
      .catch(next);
  }

  updateOneNoValidatePromise(data, userId, addUpdatedBy = true) {
    return this.repo.update(data, userId, true, false, addUpdatedBy)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          return this.pgRepo.addOne(_.clone(item), userId)
            .then(() => item);
        } else {
          return item;
        }
      });
  }

  updateOneNoValidate(req, res, next) {
    this.updateOneNoValidatePromise(req.body, req.user.id)
      .then(item => res.json(item))
      .catch(next);
  }

  // post /call-method/:method
  callMethod(req, res, next) {
    const method = this[req.params.method];
    if (!method) {
      throw new ApiError(`Controller Base: no method found for ${req.params.method}.`);
    }
    method.call(this, req, res, next);
  }

  // post /upsert
  upsert(req, res, next) {
    this.repo.getOneById(req.body.id)
      .then(item => {
        if (item) {
          this.update(req, res, next);
        } else {
          this.addOne(req, res, next);
        }
      })
      .catch(next);
  }

  // post /query-post
  queryPost(req, res, next) {
    req.query = req.body;
    this.getMany(req, res, next);
  }

  // post /add-many
  addMany(req, res, next) {
    const data = req.body;
    this.repo.addMany(data, req.user.id)
      .then(() => {
        if (this.pgRepo && this.isMirrorRepo) {
          this.pgRepo.addMany(data, req.user.id)
            .then(() => res.end());
        } else {
          res.end();
        }
      })
      .catch(next);
  }

  // post /query-one
  upsertQueryOne(req, res, next) {
    const data = req.body;
    const filter = req.query;
    this.repo.upsertQueryOne(filter, data, req.user.id)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          this.pgRepo.upsertQueryOne(filter, _.clone(item), req.user.id)
            .then(() => res.json(item));
        } else {
          res.json(item);
        }
      })
      .catch(next);
  }

  // post /sync-records
  syncRecordsById(req, res, next) {
    this.repo.syncRecordsById(req.query, req.body, req.user.id)
      .then(() => res.end());
  }

  // post /sync-records
  // this is a placeholder, you have to override this and supply the
  // uniqueFilterOrProps and predicate values, then call super with all
  syncRecordsQueryOne(req, res, next) {
    this.repo.syncRecordsQueryOne(req.query, null, null, req.body, req.user.id)
      .then(() => res.end());
  }

  // post /sync-records
  syncRecordsReplaceAll(req, res, next) {
    this.repo.syncRecordsReplaceAll(req.query, req.body, req.user.id)
      .then(() => res.end());
  }

  mongoToPgSyncTransform(objs, userId, log, elog) {
    return objs;
  }

  mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa?) {
    return this.pgRepo.syncRecordsReplaceAll(pgRemoveFilter, objs, userId, true)
      .then(results => results.recordCount);
  }

  mongoToPgSync(tableName: string, userId: string, log: string[], elog: string[],
                mgGetFilter: AnyObj = {}, pgRemoveFilter: AnyObj = {}, dfa?: ApiDfaData) {


    // q.allSettled requires promise rejections to work. If we throw, it will jsut get passed onto express error handler

    if (this.repo.isModuleRepo && !mgGetFilter.then && mgGetFilter.moduleId !== -1) {
      elog.push(`mongoToPgSync: ${this.repo.modelName} isModuleRepo but doesn't have mgGetFilter.moduleId set to -1.`);
    }

    const mongoGetPromise = mgGetFilter.then ? mgGetFilter : this.repo.getMany(mgGetFilter);
    return shUtil.promiseChain(mongoGetPromise)
      .then(docs => {
        if (docs.length && docs[0].toObject) {
          return docs.map(doc => doc.toObject());
        } else {
          return docs;
        }
      })
      .then(objs => this.mongoToPgSyncTransform(objs, userId, log, elog)) // override this to transform
      .then(objs => this.mongoToPgSyncRecords(pgRemoveFilter, objs, userId, dfa))
      .then(recordCount => {
        return this.postSyncStep(dfa)
          .then(() => log.push(`${tableName}: ${recordCount} records transferred`));
      })
      .catch(_err => {
        elog.push(`${tableName}: ${_err.message}`);
        const err = svrUtil.getErrorForJson(_err);
        err.stack = err.stack ? err.stack.substr(0, 100) : undefined;
        return Promise.reject(err);
      });
  }

  postSyncStep(dfa: ApiDfaData): Promise<any> {
    return Promise.resolve();
  }

  // put /:id
  updatePromise(req, res, next) {
    const data = req.body;
    return this.repo.update(data, req.user.id)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          // we have to clone item as prRepo will change the updatedDate and we'll fail concurrency check
          // we need the same mongo updatedDate to pass concurrency check. We turn off pg's concurrency
          // check as we can't have both.
          return this.pgRepo.updateOneById(_.clone(item), req.user.id, false)
            .then(() => item);
        } else {
          return item;
        }
      })
      .catch(next);
  }

  update(req, res, next) {
    this.updatePromise(req, res, next)
      .then(item => res.json(item))
      .catch(next);
  }

  // delete /:id
  remove(req, res, next) {
    this.removeOnePromise(req, res, next)
      .then(item => res.json(item))
      .catch(next);
  }

  removeOnePromise(req, res, next) {
    return this.repo.remove(req.params.id)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          return this.pgRepo.removeOne(req.query.postgresIdProp)
            .then(() => item);
        } else {
          return item;
        }
      });
  }

  // delete /query-one
  removeQueryOne(req, res, next) {
    const filter = req.query;
    this.repo.removeQueryOne(filter)
      .then(item => {
        if (this.pgRepo && this.isMirrorRepo) {
          this.pgRepo.removeQueryOne(filter)
            .then(() => res.json(item));
        } else {
          res.json(item); // returns {recordCount: xxx}
        }
      })
      .catch(next);
  }

  verifyProperties(data, arr) {
    const missingProps = [];
    arr.forEach(prop => {
      if (!data[prop]) {
        missingProps.push(prop);
      }
    });
    if (missingProps.length) {
      throw new ApiError(`Properties missing: ${missingProps.join(', ')}.`, data, 400);
    }
  }

  // return false if name exists in list
  validateNameDoesntExist(name: string, editMode: boolean, moduleId = null, upper = true) {
    const filter: AnyObj = {getDistinct: 'name'};
    if (moduleId) {
      filter.moduleId = moduleId;
    }
    return this.repo.getMany(filter)
      .then(names => {
        if (upper) {
          names = names.map(x => x.toUpperCase());
          name = name.toUpperCase();
        }

        if (editMode) {
          names = _.without(names, name);
        }
        return !_.includes(names, name);
      });
  }

}


import {ApiError} from '../common/api-error';
import _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import RepoBase from './repo-base';
import {PostgresRepoBase} from './pg-repo-base';

export default class ControllerBase {

  constructor(protected repo: RepoBase, protected pgRepo?: PostgresRepoBase) {
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

  getMany(req, res, next) {
    this.getManyPromise(req)
      .then(items => res.json(items))
      .catch(next);
  }

  getQueryOne(req, res, next) {
    const setNoError = req.query.setNoError;
    delete req.query.setNoError;
    this.repo.getOneByQuery(req)
      .then(item => {
        if (item) {
          res.json(item);
        } else if (setNoError) {
          res.status(204).end();
        } else {
          next(new ApiError('Not found', null, 404));
        }
      })
      .catch(next);
  }

  // ui will always add error modal on 404, we'll allow a querystring "setNoError" to defeat this
  getOne(req, res, next) {
    this.repo.getOneById(req.params.id)
      .then(item => {
        if (item) {
          res.json(item);
        } else if (req.query.setNoError) {
          res.status(204).end();
        } else {
          next(new ApiError('Not found', null, 404));
        }
      })
      .catch(next);
  }

  // if queryPost querystring, then just a query with params in body instead of querystring
  // insertMany querystring: insertMany, else insert one
  handlePost(req, res, next) {
    const data = req.body;
    if (req.query.queryPost) {
      req.query = req.body;
      this.getMany(req, res, next);
    } else if (req.query.setSyncRecords) {
      delete req.query.setSyncRecords
      this.repo.syncRecords(req.query, null, req.body, req.user.id);
    } else if (req.query.insertMany) {
      this.repo.addMany(data, req.user.id)
        .then(() => {
          if (this.pgRepo) {
            this.pgRepo.addMany(data, req.user.id)
              .then(() => res.end());
          } else {
            res.end();
          }
        })
        .catch(next);
    } else {
      this.repo.addOne(data, req.user.id)
        .then(item => {
          if (this.pgRepo) {
            this.pgRepo.addOne(_.clone(item), req.user.id)
              .then(() => res.json(item));
          } else {
            res.json(item);
          }
        })
        .catch(next);
    }
  }

  upsertQueryOne(req, res, next) {
    const data = req.body;
    const filter = req.query;
    this.repo.upsertQueryOne(filter, data, req.user.id)
      .then(item => {
        if (this.pgRepo) {
          this.pgRepo.upsertQueryOne(filter, _.clone(item), req.user.id)
            .then(() => res.json(item));
        } else {
          res.json(item);
        }
      })
      .catch(next);
  }

  update(req, res, next) {
    const data = req.body;
    data.id = req.params.id;
    this.repo.update(data, req.user.id)
      .then(item => {
        if (this.pgRepo) {
          // we have to clone item as prRepo will change the updatedDate and we'll fail concurrency check
          // we need the same mongo updatedDate to pass concurrency check. We turn off pg's concurrency
          // check as we can't have both.
          this.pgRepo.updateOne(_.clone(item), req.user.id, false)
            .then(() => res.json(item));
        } else {
          res.json(item);
        }
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.repo.remove(req.params.id)
      .then(item => {
        if (this.pgRepo) {
          this.pgRepo.removeOne(req.query.postgresIdProp)
            .then(() => res.json(item));
        } else {
          res.json(item);
        }
      })
      .catch(next);
  }

  removeQueryOne(req, res, next) {
    const filter = req.query;
    this.repo.removeQueryOne(filter)
      .then(item => {
        if (this.pgRepo) {
          this.pgRepo.removeQueryOne(filter)
            .then(() => res.json(item));
        } else {
          res.json(item);
        }
      })
      .catch(next);
  }

  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400);
      }
    })
  }

}


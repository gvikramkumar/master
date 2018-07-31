import {ApiError} from '../common/api-error';
import _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import RepoBase from './repo-base';
import {PostgresRepoBase} from './pg-repo-base';

export default class PostgresControllerBase {

  constructor(protected repo: PostgresRepoBase) {
  }

  // post /method/:method
  callMethod(req, res, next) {
    const method = this[req.params.method];
    if (!method) {
      throw new ApiError(`PostgresLookupController: no method found for ${req.params.method}`)
    }
    method.call(this, req, res, next);
  }

  // we have this functionality required in other api classes, so pull it out of
  // controller's getMany to reuse
  getManyPromise(req) {
    let promise;
    /*
        if (req.query.groupField) {
          promise = this.repo.getManyByGroupLatest(req.query);
        } else if (req.query.getLatest) {
          promise = this.repo.getOneLatest(req.query);
        } else {
          promise = this.repo.getMany(req.query);
        }
    */
    promise = this.repo.getMany(req.query);
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
          next(new ApiError('Not found', null, 404));
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
          next(new ApiError('Not found', null, 404));
        }
      })
      .catch(next);
  }

  // post /
  addOne(req, res, next) {
    const data = req.body;
    this.repo.addOne(data, req.user.id)
      .then(item => res.json(item))
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
      .then(() => res.end())
      .catch(next);
  }

  // post /query-one
  upsertQueryOne(req, res, next) {
    const data = req.body;
    const filter = req.query;
    this.repo.upsertQueryOne(filter, data, req.user.id)
      .then(item => res.json(item))
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
    this.repo.syncRecordsQueryOne(req.query, null,  null, req.body, req.user.id)
      .then(() => res.end());
  }

  // post /sync-records
  syncRecordsReplaceAll(req, res, next) {
    this.repo.syncRecordsReplaceAll(req.query, req.body, req.user.id)
      .then(() => res.end());
  }

  // put /:id
  update(req, res, next) {
    const data = req.body;
    data[this.repo.idProp] = req.params.id;
    this.repo.updateOne(data, req.user.id)
      .then(item => res.json(item))
      .catch(next);
  }

  // delete /:id
  remove(req, res, next) {
    this.repo.removeOne(req.params.id)
      .then(item => {
        res.json(item);
      })
      .catch(next);
  }

  // delete /query-one
  removeQueryOne(req, res, next) {
    const filter = req.query;
    this.repo.removeQueryOne(filter)
      .then(item => res.json(item))
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


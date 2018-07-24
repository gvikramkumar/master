import {ApiError} from '../common/api-error';
import _ from 'lodash';
import {svrUtil} from '../common/svr-util';
import RepoBase from './repo-base';
import {PostgresRepoBase} from './pg-repo-base';

export default class PostgresControllerBase {

  constructor(protected repo: PostgresRepoBase) {
  }

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

  getMany(req, res, next) {
    this.getManyPromise(req)
      .then(items => res.json(items))
      .catch(next);
  }

  getOne(req, res, next) {
    this.repo.getOne(req.params.id)
      .then(item => {
        if (item) {
          res.json(item);
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
    } else if (req.query.insertMany) {
      this.repo.addMany(data, req.user.id)
        .then(() => {
          res.end();
        })
        .catch(next);
    } else {
      this.repo.addOne(data, req.user.id)
        .then(item => {
          res.json(item);
        })
        .catch(next);
    }
  }

  update(req, res, next) {
    const data = req.body;
    this.verifyProperties(data, [this.repo.idProp]);
    this.repo.updateOne(data, req.user.id)
      .then(item => {
        res.json(item);
      })
      .catch(next);
  }

  remove(req, res, next) {
    this.repo.removeOne(req.params.id)
      .then(item => {
        res.json(item);
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


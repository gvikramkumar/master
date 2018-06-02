const ApiError = require('../common/api-error'),
  _ = require('lodash'),
  util = require('../common/util');

module.exports = class ControllerBase {

  constructor(repo) {
    this.repo = repo;
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
      promise = this.repo.getManyByGroupLatest(req.query)
    } else if (req.query.getLatest) {
      promise = this.repo.getOneLatest(req.query)
    } else {
      promise = this.repo.getMany(req.query);
    }
    return promise;
  }

  getMany(req, res, next) {
    this.getManyPromise(req)
      .then(items => res.send(items))
      .catch(next);
  }

  getOne(req, res, next) {
    this.repo.getOneById(req.params.id)
      .then(item => {
        if (item) {
          res.send(item);
        } else {
          res.status(404).end();
        }
      })
      .catch(next)
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
        .then(() => res.end())
        .catch(next);
    } else {
      this.repo.addOne(data, req.user.id)
        .then(item => res.send(item))
        .catch(next);
    }
  }

  update(req, res, next) {
    const data = req.body;
    this.verifyProperties(data, ['id']);
    this.repo.update(data, req.user.id)
      .then(item => {
        res.send(item);
      })
      .catch(next)
  }

  remove(req, res, next) {
    this.repo.remove(req.params.id)
      .then(item => res.send(item))
      .catch(next);
  }

  verifyProperties(data, arr) {
    arr.forEach(prop => {
      if (!data[prop]) {
        throw new ApiError(`Property missing: ${prop}.`, data, 400)
      }
    })
  }

}


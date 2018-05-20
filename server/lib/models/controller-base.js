const ApiError = require('../common/api-error');

module.exports = class ControllerBase {

  constructor(repo) {
    this.repo = repo;
  }

  // if groupField, groups by groupField and gets Latest of each group
  getMany(req, res, next) {
    let promise;
    if (req.query.groupField) {
      promise = this.repo.getManyByGroupLatest(req.query)
    } else {
      promise = this.repo.getMany(req.query);
    }

    promise
      .then(items => res.send(items))
      .catch(next);
  }

  // if id is getlatest, then req.query is filter and we get the latest value, if not there, 204 (instead of 404)
  getOne(req, res, next) {
    const getLatest = req.params.id.toLowerCase() === 'getlatest';
    let promise;
    if (getLatest) {
      promise = this.repo.getOneLatest(req.query);
    } else {
      promise = this.repo.getOneById(req.params.id);
    }
    promise.then(item => {
      if (item) {
        res.send(item);
      } else if (getLatest) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
      .catch(next)
  }

  // if queryPost querystring, then assume a getMany query with params in req.body
  add(req, res, next) {
    const data = req.body;
    if (req.query.queryPost) {
      req.query = req.body;
      this.getMany(req, res, next);
    } else {
      this.repo.add(data, req.user.id)
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


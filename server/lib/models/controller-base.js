const ApiError = require('../common/api-error');

module.exports = class ControllerBase {

  constructor(repo) {
    this.repo = repo;
  }

  // if groupField, groups by groupField and gets Latest of each group
  // else if getLatest, returns the lastest value
  getMany(req, res, next) {
    let promise;
    if (req.query.groupField) {
      promise = this.repo.getManyByGroupLatest(req.query)
    } else if (req.query.getLatest) {
      promise = this.repo.getOneLatest(req.query)
    } else {
      promise = this.repo.getMany(req.query);
    }

    promise
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

  // if queryPost querystring, then assume a getMany query with params in req.body
  // inspired by graphql, maybe easier to make some queries using the body instead of querystring
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


const ApiError = require('../common/api-error'),
  Validate = require('../common/validate');

module.exports = class ControllerBase {

  constructor(repo) {
    this.repo = repo;
  }

  getMany(req, res, next) {
    this.repo.getMany()
      .then(items => res.send(items))
      .catch(next);
  }

  getOne(req, res, next)
  {
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

  add(req, res, next) {
    const data = req.body;
    this.repo.add(data, req.user.id)
      .then(item => res.send(item))
      .catch(next);
  }

  update(req, res, next)
  {
    const data = req.body;
    this.verifyProperties(data, ['id']);
    this.repo.update(data, req.user.id)
      .then(item => {
          res.send(item);
      })
      .catch(next)
  }

  remove(req, res, next)
  {
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


const ApiError = require('../common/api-error'),
  Validate = require('../common/validate');

module.exports = class ControllerBase {

  constructor(repo, schema) {
    this.repo = repo;
    this.schema = schema;
  }

  getMany(req, res, next) {
    this.repo.getMany(req.query.limit, req.query.skip)
      .then(rules => res.send(rules))
      .catch(next);
  }

  getOne(req, res, next)
  {
    this.repo.getOne(req.params.id)
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
    const error = Validate.validateObject(data, this.schema);
    if (error) {
      throw error;
    }
    this.repo.add(data, req.user.userName)
      .then(item => res.send(item))
      .catch(next);
  }

  update(req, res, next)
  {
    const data = req.body;
    this.verifyProperties(data, ['id', 'timestamp']);
    if (req.params.id !== data.id) {
      throw new ApiError('Body id doesn\'t match url id.', data, 400)
    }
    const error = Validate.validateObject(data, this.schema);
    if (error) {
      throw error;
    }
    this.repo.update(data, req.user.userName)
      .then(item => {
        if (item) {
          res.send(item);
        } else {
          res.sendStatus(404);
        }
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


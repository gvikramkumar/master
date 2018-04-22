const express = require('express'),
  repo = require('./repo'),
  ApiError = require('../../../lib/errors/api-error'),
  Validate = require('../../../lib/validate'),
  jsonSchema = require('./schema');

const router = express.Router();
module.exports = router;

router
  .get('/', getMany)
  .post('/', add)
  .get('/:id', getOne)
  .put('/:id', update)
  .delete('/:id', remove)

function getMany(req, res, next) {
  repo.getMany(req.query.limit, req.query.skip)
    .then(rules => res.send(rules))
    .catch(next);
}

function getOne(req, res, next)
{
  repo.getOne(req.params.id)
    .then(item => {
      if (item) {
        res.send(item);
      } else {
        res.status(404).end();
      }
    })
    .catch(next)
}

function add(req, res, next) {
  const data = req.body;
  const error = Validate.validateObject(data, jsonSchema, prefix);
  if (error) {
    throw error;
  }
  repo.add(data)
    .then(item => res.send(item))
    .catch(next);
}

function update(req, res, next)
{
  const data = req.body;
  if (!data.id) {
    throw new ApiError('property missing: id', data, 400)
  }
  const error = Validate.validateObject(data, jsonSchema);
  if (error) {
    throw error;
  }
  repo.update(data)
    .then(item => {
      if (item) {
        res.send(item);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next)
}

function remove(req, res, next)
{
  repo.remove(req.params.id)
    .then(item => res.send(item))
    .catch(next);
}


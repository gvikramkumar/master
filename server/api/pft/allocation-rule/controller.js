const express = require('express'),
  repo = require('./repo');

router = express.Router();
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
    .then(rule => {
      if (rule) {
        res.send(rule);
      } else {
        res.status(404).end();
      }
    })
    .catch(next)
}

function add(req, res, next) {
  const rule = req.body;
  repo.add(rule)
    .then(_rule => res.send(_rule))
    .catch(next);
}

function update(req, res, next)
{
  repo.update(req.body)
    .then(rule => {
      if (rule) {
        res.send(rule);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next)
}

function remove(req, res, next)
{
  repo.remove(req.params.id)
    .then(rule => res.send(rule))
    .catch(next);
}


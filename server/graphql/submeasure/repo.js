const APIError = require('../../lib/errors/api-error'),
  httpStatus = require('http-status'),
  mg = require('mongoose');

const schema = new mg.Schema(
  {
    SUB_MEASURE_KEY: {type: Number, required: true},
    SUB_MEASURE_NAME: {type: String, required: true}
  },
  {collection: 'dfa_submeasure_list'}
  );

const Submeasure = mg.model('Submeasure', schema);

function list(params) {
  const {limit = 1000, skip = 0} = params;
  return Submeasure.find()
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(x => {
      return x;
    })
}

function load(params) {

  return Submeasure.findById(params.id).exec()
    .then(rule => {
      if (rule) {
        return rule;
      }
      const err = new APIError('Item doesn\'t exist.', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
}

function create(params) {
  const rule = new Submeasure(params.data);
  return rule.save();
}

function update(params) {
  return load(params).then(rule => {
    Object.assign(rule, params.data);
    return rule.save()
  });
}

function remove(params) {
  return load(params).then(rule => rule.remove());
}

module.exports = {list, load, create, update, remove};

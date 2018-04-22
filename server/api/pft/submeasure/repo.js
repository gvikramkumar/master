const APIError = require('../../lib/errors/api-error'),
  httpStatus = require('http-status'),
  mg = require('mongoose');

const schema = new mg.Schema(
  {
    key: {type: Number, required: true},
    name: {type: String, required: true}
  },
  {collection: 'submeasure_list'}
  );

const Submeasure = mg.model('Submeasure', schema);

function getMany(params) {
  const {limit = 1000, skip = 0} = params;
  return Submeasure.find()
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(x => {
      return x;
    })
}

function getOne(params) {

  return Submeasure.findById(params.id).exec()
    .then(rule => {
      if (rule) {
        return rule;
      }
      const err = new APIError('Item doesn\'t exist.', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
}

function add(params) {
  const rule = new Submeasure(params.data);
  return rule.save();
}

function update(params) {
  return getOne(params).then(rule => {
    Object.assign(rule, params.data);
    return rule.save()
  });
}

function remove(params) {
  return getOne(params).then(rule => rule.remove());
}

module.exports = {getMany, getOne, add, update, remove};

const APIError = require('../../lib/errors/api-error'),
  httpStatus = require('http-status'),
  mg = require('mongoose');


const schema = new mg.Schema(
  {
    name: {type: String, required: true},
    period: {type: String, required: true},
    driverName: {type: String, required: true},
    salesMatch: {type: String},
    productMatch: {type: String},
    scmsMatch: {type: String},
    legalEntityMatch: {type: String},
    beMatch: {type: String},
    sl1Select: {type: String},
    scmsSelect: {type: String},
    beSelect: {type: String},
    createdBy: {type: String},
    createdDate: {type: String},
    updatedBy: {type: String},
    updatedDate: {type: String}
  },
  {collection: 'allocation_rules'}
);

const Rule = mg.model('Rule', schema);

function list(params) {
  const {limit = 1000, skip = 0} = params;
  return Rule.find()
    .skip(+skip)
    .limit(+limit)
    .exec()
    .then(x => {
      return x;
    })
}

function load(params) {

  return Rule.findById(params.id).exec()
    .then(rule => {
      if (rule) {
        return rule;
      }
      const err = new APIError('Item doesn\'t exist.', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
}

function create(params) {
  const rule = new Rule(params.data);
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

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

function getMany(params) {
  const {limit = 1000, skip = 0} = params;
  return Rule.find()
    .skip(Number(skip))
    .limit(Number(limit))
    .exec()
}

function getOne(params) {
  return Rule.findById(params.id).exec()
    .then(rule => {
      if(!rule) {
        const err = new APIError('Item doesn\'t exist.', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      }
      return rule;
    });
}

function getOneWithUpdatedDate(params) {
  const query = {_id: params.id};
  if (params.updatedDate) {
    query.updatedDate = params.updatedDate
  }
  return Rule.findOne(query).exec()
    .then(rule => {
      //todo: wrap this concurrency check in a unit test
      /*
      this is our concurrency check for update/delete, the only ones which will send updateDate parameter
      (if they have one)
      1. no updatedDate sent up or in database, cool
      2. no updatedDate sent up, but one in database, fail
      3. updatedDate sent, then used in search, doesn't exist, fail // someone else updated or deleted it
       */
      if(!rule || (rule.updatedDate && !params.updatedDate)) {
        const err = new APIError('Item doesn\'t exist.', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      }
      return rule;
    });
}

function add(params) {
  const rule = new Rule(params.data);
  return rule.save();
}

function update(params) {
  return getOneWithUpdatedDate(params).then(rule => {
      Object.assign(rule, params.data);
    return rule.save()
  });
}

function remove(params) {
  return getOneWithUpdatedDate(params).then(rule => rule.remove());
}

module.exports = {getMany, getOne, add, update, remove};

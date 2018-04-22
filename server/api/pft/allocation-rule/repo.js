const mg = require('mongoose'),
  BasicError = require('../../../lib/errors/basic-error');

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

function getMany(limit, skip) {
  const query = Rule.find();
  if (limit && skip !== undefined) {
    query.skip(Number(skip)).limit(Number(limit))
  }
  return query.exec();
}

function getOne(id) {
  return Rule.findById(id).exec();
}

function getOneWithUpdatedDate(item) {
  const query = {_id: item.id};
  if (item.updatedDate) {
    query.updatedDate = item.updatedDate
  }
  return Rule.findOne(query).exec()
    .then(_rule => {
      /*
      this is our concurrency check for update only
      1. no updatedDate sent up or in database, cool
      2. no updatedDate sent up, but one in database, fail
      3. updatedDate sent, then used in search, doesn't exist, fail // someone else updated or deleted it
       */
      if (!_rule || (_rule.updatedDate && !item.updatedDate)) {
        const err = new BasicError('Item doesn\'t exist.');
        return Promise.reject(err);
      }
      return item;
    });
}

function add(data) {
  const item = new Rule(data);
  return item.save();
}

function update(data) {
  return getOneWithUpdatedDate(data)
    .then(item => {
    Object.assign(item, data);
    return item.save()
  });
}

function remove(id) {
  return getOne(id)
    .then(item => item.remove());
}

module.exports = {getMany, getOne, add, update, remove};

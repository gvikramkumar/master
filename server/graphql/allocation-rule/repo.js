const APIError = require('../../lib/errors/api-error'),
  httpStatus = require('http-status'),
  mg = require('mongoose');

const schema = new mg.Schema(
  {
    RULE_NAME: {type: String, required: true},
    PERIOD: {type: String, required: true},
    DRIVER_NAME: {type: String, required: true},
    SALES_MATCH: {type: String},
    PRODUCT_MATCH: {type: String},
    SCMS_MATCH: {type: String},
    LEGAL_ENTITY_MATCH: {type: String},
    BE_MATCH: {type: String},
    SL1_SELECT: {type: String},
    SCMS_SELECT: {type: String},
    BE_SELECT: {type: String},
    CREATED_BY: {type: String},
    CREATE_DATE: {type: String},
    UPDATED_BY: {type: String},
    UPDATE_DATE: {type: String}
  },
  {collection: 'dfa_allocation_rules'}
);

/*
// todo: not needed? Needed this in dk-crud, why not here? no id in data, so how exactly does it show up without a virtual?
userSchema.set('toObject', { virtuals: true });
userSchema.virtual('id').get(function() {
  return this._id.toString();
});
*/


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
      const err = new APIError('No such post exists!', httpStatus.NOT_FOUND);
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

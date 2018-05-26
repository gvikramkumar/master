const mg = require('mongoose'),
  _ = require('lodash');

const schema = new mg.Schema(
  {
    type: String,
    values: []
  },
  {collection: 'lookup'}
);

module.exports = class LookupRepo {
  constructor() {
    this.Model = mg.model('Lookup', schema);
  }

  getValuesByType(type) {
    return this.Model.findOne({type}).exec()
      .then(doc => doc.values);
  }

  getTextValuesByTypeandSortedUpperCase(type) {
    return this.getValuesByType(type)
      .then(values => values.map(value => value.toUpperCase()))
      .then(values => _.sortBy(values, _.identity));
  }

}

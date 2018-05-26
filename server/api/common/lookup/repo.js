const mg = require('mongoose');

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

}

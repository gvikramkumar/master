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

  getOne(filter) {
    return this.Model.findOne(filter).exec();
  }

}

const mg = require('mongoose'),
  RepoBase = require('../../../lib/models/repo-base');

const schema = new mg.Schema(
  {
    key: {type: Number, required: true},
    name: {type: String, required: true}
  },
  {collection: 'submeasure'}
);

module.exports = class SubmeasureRepo extends RepoBase {
  constructor() {
    super(schema, 'Submeasure');
  }

  getOneByName(name) {
    return this.Model.findOne({name});
  }


  // getOneLatest(field, val)
  //getOneByField(field, val)
  // getOneByName(name)
  // nameExists()
  // getLatestByName(name)
  // getLatestByGroup(field)

}


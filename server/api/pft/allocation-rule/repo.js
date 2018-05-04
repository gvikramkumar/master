const mg = require('mongoose'),
  RepoBase = require('../../../lib/base-classes/repo-base'),
  db = mg.connection.db;


const schema = new mg.Schema(
  {
    name: {type: String, required: true},
    period: {type: String, required: true},
    driverName: {type: String, required: true},
    salesMatch: String,
    productMatch: String,
    scmsMatch: String,
    legalEntityMatch: String,
    beMatch: String,
    sl1Select: String,
    scmsSelect: String,
    beSelect: String,
    createdBy: String,
    createdDate: String,
    updatedBy: String,
    updatedDate: String
  },
  {collection: 'allocation_rule'}
);

module.exports = class AllocationRuleRepo extends RepoBase {
  constructor() {
    super(schema, 'Rule');
  }

  getManyLatest(limit, skip) {
    const coll = db.collection('allocation_rule');
    return coll.aggregate([
      {$sort: {uploadDate: -1}},
      {$group: {_id: '$name', id: {$first: '$_id'}}},
      {$project: {_id: '$id'}}
    ])
      .toArray().then(arr => {
        const ids = arr.map(obj => obj._id);
        const cursor = coll.find({_id: {$in: ids}}).sort({name: 1});
        if (limit && skip) {
          cursor.skip(+skip).limit(+limit);
        }
        return cursor.toArray();
      });
  }
}

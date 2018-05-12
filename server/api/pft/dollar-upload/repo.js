const mg = require('mongoose'),
  RepoBase = require('../../../lib/models/repo-base'),
  db = mg.connection.db;

const schema = new mg.Schema(
  {
    measureName: String,
    subMeasureName: String,
    inputProductValue: String,
    inputProductHierLevelId: Number,
    inputProductHierLevelName: String,
    inputEntityValue: String,
    inputEntityHierLevelId: Number,
    inputEntityHierLevelName: String,
    inputSalesValue: String,
    inputSalesHierLevelId: Number,
    inputSalesHierLevelName: String,
    scmsValue: String,
    scmsHierLevelId: Number,
    scmsHierLevelName: String,
    inputBusinessValue: String,
    inputBusinessHierLevelId: Number,
    inputBusinessHierLevelName: String,
    dealId: Number,
    grossUnbilledAccruedRevFlg: Boolean,
    revenueClassification: String,
    amount: Number,
    createdBy: String,
    createdDate: Date,
    updatedBy: String,
    updatedDate: Date
  },
  {collection: 'dollar_upload'}
);

module.exports = class DollarUploadRepo extends RepoBase {
  constructor() {
    super(schema, 'DollarUpload');
  }

  getManyLatest() {
    return this.Model.aggregate([
      {$sort: {updatedDate: -1}},
      {$group: {_id: '$name', id: {$first: '$_id'}}},
      {$project: {_id: '$id'}}
    ])
      .then(arr => {
        const ids = arr.map(obj => obj._id);
        return this.Model.find({_id: {$in: ids}}).exec();
      });
  }
}

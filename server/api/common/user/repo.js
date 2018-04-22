const mg = require('mongoose');

const userSchema = mg.Schema({
  name: {type: String, required: true},
  age: {type: Number}
});

// userSchema.virtual('id').get(() => this._id);
userSchema.set('toObject', { virtuals: true });
userSchema.virtual('id').get(function() {
  return this._id.toString();
});

/*
//this doesn't work, "this" here is just an empty object, not the model object
userSchema.virtual('id').get(() => {
  return this._id;
});
*/

/*
var virtual = userSchema.virtual('id');
virtual.get(function () {
  return this._id;
});
*/

userSchema.statics.list = function (cb) {
  this.find(cb);
}

const User = mg.model('User', userSchema);
module.exports = User;

exports.getAll = function ({skip, limit}) {
  const query = User.find();

  if (skip !== undefined && limit !== undefined) {
    query.skip(+skip).limit(+limit)
  }
  return query.exec();
}

exports.getOne = function ({id}) {
  return User.findById(id).exec();
}

exports.addOne = function ({data}) {
  return User.create(data);
}

exports.updateOne = function ({id, data}) {
  return User.replaceOne({_id: id}, data)
    .then(() => User.findById(id).exec())
}

exports.removeOne = function ({id}) {
  return User.findById(id)
    .then(user => user.remove());
}


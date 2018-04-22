const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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

const User = mongoose.model('User', userSchema);
module.exports = User;




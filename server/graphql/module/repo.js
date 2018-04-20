const mg = require('mongoose');

const schema = new mg.Schema(
  {
    name: {type: String, required: true}
  },
  {collection: 'dfa_modules'}
);

const Module = mg.model('Module', schema);

function list() {
  return Module.find().exec();
}

module.exports = {list};

const mg = require('mongoose');

const schema = new mg.Schema(
  {
    name: {type: String, required: true}
  },
  {collection: 'modules'}
);

const Module = mg.model('Module', schema);

function getMany() {
  return Module.find().exec();
}

module.exports = {getMany};

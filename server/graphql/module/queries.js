const gq = require('graphql');
const Module = require('./module');
const repo = require('./repo');

module.exports = {

  getModules: {
    type: new gq.GraphQLList(Module),
    resolve (root, params) {
      return repo.getMany(params)
    }
  }

}

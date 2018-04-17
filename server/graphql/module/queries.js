const gq = require('graphql');
const Module = require('./module');
const repo = require('./repo');

module.exports = {

  modules: {
    type: new gq.GraphQLList(Module),
    resolve (root, params) {
      return repo.list(params)
    }
  }

}

const gq = require('graphql');
const AllocationRule = require('./allocation-rule');
const repo = require('./repo');

module.exports = {

  getRules: {
    type: new gq.GraphQLList(AllocationRule),
    args: {
      limit: {name: 'limit', type: gq.GraphQLInt},
      skip: {name: 'skip', type: gq.GraphQLInt}
    },
    resolve (root, params) {
      return repo.getMany(params)
    }
  },

  getRule: {
    type: AllocationRule,
    args: {
      id: {name: 'id', type: new gq.GraphQLNonNull(gq.GraphQLID)}
    },
    resolve (root, params) {
      return repo.getOne(params)
    }
  }

}

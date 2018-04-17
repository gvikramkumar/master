const gq = require('graphql');
const AllocationRule = require('./allocation-rule');
const repo = require('./repo');

module.exports = {

  rules: {
    type: new gq.GraphQLList(AllocationRule),
    args: {
      limit: {
        name: 'limit',
        type: gq.GraphQLInt
      },
      skip: {
        name: 'skip',
        type: gq.GraphQLInt
      }
    },
    resolve (root, params) {
      return repo.list(params)
    }
  },

  rule: {
    type: AllocationRule,
    args: {
      id: {
        name: 'id',
        type: new gq.GraphQLNonNull(gq.GraphQLID)
      },
    },
    resolve (root, params) {
      return repo.load(params)
    }
  }

}

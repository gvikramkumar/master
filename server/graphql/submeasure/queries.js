const gq = require('graphql');
const Submeasure = require('./submeasure');
const repo = require('./repo');

module.exports = {

  submeasures: {
    type: new gq.GraphQLList(Submeasure),
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

  submeasure: {
    type: Submeasure,
    args: {
      id: {
        name: 'id',
        type: new gq.GraphQLNonNull(gq.GraphQLID)
      }
    },
    resolve (root, params) {
      return repo.load(params)
    }
  }

}

const gq = require('graphql');
const Submeasure = require('./submeasure');
const SubmeasureInput = require('./submeasure-input');
const repo = require('./repo');

module.exports = {

  addSubmeasure: {
    type: Submeasure,
    args: {
      data: {
        name: 'data',
        type: new gq.GraphQLNonNull(SubmeasureInput)
      }
    },
    resolve (root, params) {
      return repo.create(params);
    }
  },

  updateSubmeasure: {
    type: Submeasure,
    args: {
      id: {
        name: 'id',
        type: new gq.GraphQLNonNull(gq.GraphQLID)
      },
      data: {
        name: 'data',
        type: SubmeasureInput
      }
    },
    resolve (root, params) {
      return repo.update(params);
    }
  },

  removeSubmeasure: {
    type: Submeasure,
    args: {
      id: {
        name: 'id',
        type: new gq.GraphQLNonNull(gq.GraphQLID)
      }
    },
    resolve (root, params) {
      return repo.remove(params);
    }
  }

}

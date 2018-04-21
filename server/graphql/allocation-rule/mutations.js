const gq = require('graphql');
const AllocationRule = require('./allocation-rule');
const AllocationRuleInput = require('./allocation-rule-input');
const repo = require('./repo');

module.exports = {

  addRule: {
    type: AllocationRule,
    args: {
      data: {name: 'data', type: new gq.GraphQLNonNull(AllocationRuleInput)}
    },
    resolve (root, params) {
      return repo.add(params);
    }
  },

  updateRule: {
    type: AllocationRule,
    args: {
      id: {name: 'id', type: new gq.GraphQLNonNull(gq.GraphQLID)},
      updatedDate: {name: 'id', type: gq.GraphQLString},
      data: {name: 'data', type: AllocationRuleInput}
    },
    resolve (root, params) {
      return repo.update(params);
    }
  },

  removeRule: {
    type: AllocationRule,
    args: {
      id: {name: 'id', type: new gq.GraphQLNonNull(gq.GraphQLID)},
      updatedDate: {name: 'id', type: gq.GraphQLString}
    },
    resolve (root, params) {
      return repo.remove(params);
    }
  }

}

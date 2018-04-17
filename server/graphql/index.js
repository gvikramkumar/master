const gq = require('graphql');
const allocationRuleQueries = require('./allocation-rule/queries');
const allocationRuleMutations = require('./allocation-rule/mutations');

module.exports = new gq.GraphQLSchema({
  query: new gq.GraphQLObjectType({
    name: 'Query',
    fields: {
      ...allocationRuleQueries
    }
  }),
  mutation: new gq.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...allocationRuleMutations
    }
  })
});

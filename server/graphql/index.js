const gq = require('graphql');
const allocationRuleQueries = require('./allocation-rule/queries');
const allocationRuleMutations = require('./allocation-rule/mutations');
const submeasureQueries = require('./submeasure/queries');
const submeasureMutations = require('./submeasure/mutations');
const moduleQueries = require('./module/queries');

module.exports = new gq.GraphQLSchema({
  query: new gq.GraphQLObjectType({
    name: 'Query',
    fields: {
      ...allocationRuleQueries, ...moduleQueries, ...submeasureQueries
    }
  }),
  mutation: new gq.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...allocationRuleMutations, ...submeasureMutations
    }
  })
});

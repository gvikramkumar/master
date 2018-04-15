const graphql = require('graphql');
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLSchema = graphql.GraphQLSchema;

const userQueries = require('./user/queries');
const userMutations = require('./user/mutations');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {...userQueries}
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {...userMutations}
  })
});

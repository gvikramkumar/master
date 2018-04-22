const graphql = require('graphql');
const GraphQLNonNull = graphql.GraphQLNonNull;
const GraphQLString = graphql.GraphQLString;
const GraphQLInt = graphql.GraphQLInt;
const GraphQLInputObjectType = graphql.GraphQLInputObjectType;

module.exports = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: () => ({
    name: {type: new GraphQLNonNull(GraphQLString)},
    age: {type: GraphQLInt}
  })
});

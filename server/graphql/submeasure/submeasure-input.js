const gq = require('graphql');

module.exports = new gq.GraphQLInputObjectType({
  name: 'SubmeasureInput',
  fields: () => ({
    key: {type: gq.GraphQLInt},
    name: {type: gq.GraphQLString}
  })
});

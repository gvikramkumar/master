const gq = require('graphql');

module.exports = new gq.GraphQLInputObjectType({
  name: 'SubmeasureInput',
  fields: () => ({
    SUB_MEASURE_KEY: {type: gq.GraphQLInt},
    SUB_MEASURE_NAME: {type: gq.GraphQLString}
  })
});

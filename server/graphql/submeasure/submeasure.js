const gq = require('graphql');

module.exports = new gq.GraphQLObjectType({
  name: 'Submeasure',
  fields: () => ({
    id: {type: gq.GraphQLID},
    SUB_MEASURE_KEY: {type: gq.GraphQLInt},
    SUB_MEASURE_NAME: {type: gq.GraphQLString}
  })
});

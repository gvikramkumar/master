const gq = require('graphql');

module.exports = new gq.GraphQLObjectType({
  name: 'Submeasure',
  fields: () => ({
    id: {type: gq.GraphQLID},
    key: {type: gq.GraphQLInt},
    name: {type: gq.GraphQLString}
  })
});

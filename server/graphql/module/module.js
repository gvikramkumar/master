const gq = require('graphql');

  module.exports =  new gq.GraphQLObjectType({
    name: 'Module',
    fields: () => ({
      id: {type: gq.GraphQLID},
      name: {type: gq.GraphQLString}
    })
  });

const gq = require('graphql');

module.exports = new gq.GraphQLInputObjectType({
  name: 'RuleInput',
  fields: () => ({
    name: {type: gq.GraphQLString},
    period: {type: gq.GraphQLString},
    driverName: {type: gq.GraphQLString},
    salesMatch: {type: gq.GraphQLString},
    productMatch: {type: gq.GraphQLString},
    scmsMatch: {type: gq.GraphQLString},
    legalEntityMatch: {type: gq.GraphQLString},
    beMatch: {type: gq.GraphQLString},
    sl1Select: {type: gq.GraphQLString},
    scmsSelect: {type: gq.GraphQLString},
    beSelect: {type: gq.GraphQLString},
    createdBy: {type: gq.GraphQLString},
    createdDate: {type: gq.GraphQLString},
    updatedBy: {type: gq.GraphQLString},
    updatedDate: {type: gq.GraphQLString}
  })
});


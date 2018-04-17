const gq = require('graphql');

  module.exports =  new gq.GraphQLObjectType({
    name: 'Rule',
    fields: () => ({
      id: {
        type: gq.GraphQLID
      },
      RULE_NAME: {
        type: gq.GraphQLString
      },
      PERIOD: {
        type: gq.GraphQLString
      },
      DRIVER_NAME: {
        type: gq.GraphQLString
      },
      SALES_MATCH: {
        type: gq.GraphQLString
      },
      PRODUCT_MATCH: {
        type: gq.GraphQLString
      },
      SCMS_MATCH: {
        type: gq.GraphQLString
      },
      LEGAL_ENTITY_MATCH: {
        type: gq.GraphQLString
      },
      BE_MATCH: {
        type: gq.GraphQLString
      },
      SL1_SELECT: {
        type: gq.GraphQLString
      },
      SCMS_SELECT: {
        type: gq.GraphQLString
      },
      BE_SELECT: {
        type: gq.GraphQLString
      },
      CREATED_BY: {
        type: gq.GraphQLString
      },
      CREATE_DATE: {
        type: gq.GraphQLString
      },
      UPDATED_BY: {
        type: gq.GraphQLString
      },
      UPDATE_DATE: {
        type: gq.GraphQLString
      }
    })
  });

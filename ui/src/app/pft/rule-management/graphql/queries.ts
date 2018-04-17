import gql from 'graphql-tag';

/* export const GetPostDetailQuery= gql`
     query GetPostDetailQuery($id: ID!) {
        post(id: $id) {
            id
            title
            content
        }
    }
`;

export const GetPostsQuery = gql`
  query Posts {
    posts {
        id
        title
        content
    }
  }
`; */

export const GetRuleDetailQuery= gql`
     query GetPostDetailQuery($id: ID!) {
        rule(id: $id) {
            id
            RULE_NAME
            PERIOD
            DRIVER_NAME
            SALES_MATCH
            PRODUCT_MATCH
            SCMS_MATCH
            LEGAL_ENTITY_MATCH
            BE_MATCH
            SL1_SELECT
            SCMS_SELECT
            BE_SELECT
            CREATED_BY
            CREATE_DATE
            UPDATED_BY
            UPDATE_DATE
        }
    }
`;

export const GetPostsQuery = gql`
  query Rules {
    rules {
        id
        RULE_NAME
        PERIOD
        DRIVER_NAME
        SALES_MATCH
        PRODUCT_MATCH
        SCMS_MATCH
        LEGAL_ENTITY_MATCH
        BE_MATCH
        SL1_SELECT
        SCMS_SELECT
        BE_SELECT
        CREATED_BY
        CREATE_DATE
        UPDATED_BY
        UPDATE_DATE
    }
  }
`;
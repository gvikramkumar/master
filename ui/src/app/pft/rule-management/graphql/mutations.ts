import gql from 'graphql-tag';

export const RemoveRuleMutation = gql`
    mutation removePost($id: ID!) {
        removePost(id: $id) {
            id
            title
        }
    }
`;

export const UpdateRuleMutation = gql`
    mutation updateRule($id: ID!, $data: RuleInput) { 
        updateRule(id: $id, data: $data) { 
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

export const AddRuleMutation = gql`
    mutation addRule($data: RuleInput!) {
    addRule(data: $data)
    }
`;
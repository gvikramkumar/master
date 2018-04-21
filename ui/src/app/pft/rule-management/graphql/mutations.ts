import gql from 'graphql-tag';

export const RemoveRuleMutation = gql`
    mutation removeRule($id: ID!) {
        removeRule(id: $id) {
            id
            name
        }
    }
`;

export const UpdateRuleMutation = gql`
    mutation updateRule($id: ID!, $data: RuleInput) { 
        updateRule(id: $id, data: $data) { 
        id
        name
        period
        driverName
        salesMatch
        productMatch
        scmsMatch
        legalEntityMatch
        beMatch
        sl1Select
        scmsSelect
        beSelect
        createdBy
        createdDate
        updatedBy
        updatedDate
        }
    }
`;

export const AddRuleMutation = gql`
    mutation addRule($data: RuleInput!) {
      addRule(data: $data) {
        id
      }
    }
`;

import gql from 'graphql-tag';

export const GetModules = gql`
  query Modules {
    modules {
        id
        name
    }
  }
`;

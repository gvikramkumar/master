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

export const GetPostDetailQuery= gql`
     query GetPostDetailQuery($id: ID!) {
        submeasure(id: $id) {
            id
            SUB_MEASURE_KEY
            SUB_MEASURE_NAME
        }
    }
`;

export const GetPostsQuery = gql`
  query Submeasure {
    submeasures {
    
        SUB_MEASURE_KEY
        SUB_MEASURE_NAME
    }
  }
`;
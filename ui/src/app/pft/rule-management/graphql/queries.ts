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

export const GetPostsQuery = gql`
  query Rules {
    rules {
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

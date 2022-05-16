import { gql } from '@apollo/client';

export const QUERY_PERSON = gql`
  query person {
    users {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

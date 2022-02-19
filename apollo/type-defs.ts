import { gql } from "apollo-server-micro"

export const typeDefs = gql`
  type PageInfo {
    endCursor: String
    hasNextPage: Boolean
  }

  type Person {
    id: ID!
    name: String!
    fromDate: String!
    toDate: String!
    searchString: String!
    imageUrl: String!
    pricePerQty: Float!
    pageInfo: PageInfo
  }

  type Query {
    persons(
      date: String!
      searchString: String!
      minPrice: Int
      maxPrice: Int
      sortOrder: String
      first: Int
      afterCursor: String
    ): [Person]
  }
`

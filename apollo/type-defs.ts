import { gql } from "apollo-server-micro"

export const typeDefs = gql`
  type Person {
    id: ID!
    name: String!
    fromDate: String!
    toDate: String!
    searchString: String!
    imageUrl: String!
    pricePerQty: Float!
  }

  type Query {
    persons(
      date: String!
      searchString: String!
      minPrice: Int
      maxPrice: Int
      sortOrder: String
      cursor: Int
      limit: Int
    ): [Person]
  }
`

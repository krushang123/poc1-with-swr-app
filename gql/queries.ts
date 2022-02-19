import { gql } from "@apollo/client"

export const GET_PERSONS = gql`
  query Persons(
    $date: String!
    $searchString: String!
    $minPrice: Int
    $maxPrice: Int
    $sortOrder: String
    $first: Int
    $afterCursor: String
  ) {
    persons(
      date: $date
      searchString: $searchString
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortOrder: $sortOrder
      first: $first
      afterCursor: $afterCursor
    ) {
      id
      name
      fromDate
      toDate
      searchString
      imageUrl
      pricePerQty
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

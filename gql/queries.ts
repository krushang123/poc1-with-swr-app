import { gql } from "@apollo/client"

export const GET_PERSONS = gql`
  query Persons(
    $date: String!
    $searchString: String!
    $minPrice: Int
    $maxPrice: Int
    $sortOrder: String
    $cursor: Int
    $limit: Int
  ) {
    persons(
      date: $date
      searchString: $searchString
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortOrder: $sortOrder
      cursor: $cursor
      limit: $limit
    ) {
      id
      name
      fromDate
      toDate
      searchString
      imageUrl
      pricePerQty
    }
  }
`

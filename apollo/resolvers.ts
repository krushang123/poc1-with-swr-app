import { isWithinInterval, parseISO } from "date-fns"
import * as R from "ramda"

import { data } from "data"

export const resolvers = {
  Query: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // persons: (_parent, args, _context, _info) => {
    //   const {
    //     date,
    //     searchString,
    //     minPrice = 1000,
    //     maxPrice = 4000,
    //     sortOrder = "asc",
    //   } = args

    //   const filterData = (date, searchString, minPrice, maxPrice, sortOrder) =>
    //     data
    //       .filter((e) =>
    //         isWithinInterval(date ? parseISO(date) : new Date(), {
    //           start: parseISO(e.fromDate),
    //           end: parseISO(e.toDate),
    //         }),
    //       )
    //       .filter((e) => {
    //         if (searchString.length === 0) {
    //           return true
    //         }
    //         return e.searchString === searchString
    //       })
    //       .filter((e) => e.pricePerQty >= minPrice && e.pricePerQty <= maxPrice)
    //       .sort((a, b) => {
    //         if (sortOrder === "asc") {
    //           return a.pricePerQty - b.pricePerQty
    //         }

    //         return b.pricePerQty - a.pricePerQty
    //       })

    //   const filteredData = filterData(
    //     date,
    //     searchString,
    //     minPrice,
    //     maxPrice,
    //     sortOrder,
    //   )

    //   const skip = (cursor - 1) * limit
    //   const take = cursor * limit
    //   return R.slice(skip, take, filteredData)
    // },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    persons: (_parent, args, _context, _info) => {
      const {
        date,
        searchString,
        minPrice = 1000,
        maxPrice = 4000,
        sortOrder = "asc",
        first = 10,
        afterCursor = "",
      } = args
      console.log("args", args)

      const filterData = (date, searchString, minPrice, maxPrice, sortOrder) =>
        data
          .filter((e) =>
            isWithinInterval(date ? parseISO(date) : new Date(), {
              start: parseISO(e.fromDate),
              end: parseISO(e.toDate),
            }),
          )
          .filter((e) => {
            if (searchString.length === 0) {
              return true
            }
            return e.searchString === searchString
          })
          .filter((e) => e.pricePerQty >= minPrice && e.pricePerQty <= maxPrice)
          .sort((a, b) => {
            if (sortOrder === "asc") {
              return a.pricePerQty - b.pricePerQty
            }

            return b.pricePerQty - a.pricePerQty
          })

      console.log("filterData", filterData)
      console.log("typefilterData", typeof filterData)

      const filteredData = filterData(
        date,
        searchString,
        minPrice,
        maxPrice,
        sortOrder,
      )
      console.log("filteredData", filteredData)

      // R.slice(0, first, filteredData)

      let queryResults

      if (afterCursor.length > 0) {
        const myCursorIndex = R.findIndex(R.propEq("id", afterCursor))(
          filteredData,
        )
        console.log("myCursorIndex", myCursorIndex)

        queryResults = R.slice(
          myCursorIndex + 1,
          first + myCursorIndex + 1,
          filteredData,
        )
      } else {
        queryResults = R.take(first, filteredData)
      }
      console.log("queryResults", queryResults)

      // return queryResults

      if (queryResults.length > 0) {
        const lastPersonInResults = queryResults[queryResults.length - 1]
        console.log("lastPersonInResults", lastPersonInResults)

        const myCursor = lastPersonInResults.id
        console.log("myCursor", myCursor)

        const myCursorIndex = R.findIndex(R.propEq("id", myCursor))(
          filteredData,
        )
        console.log("myCursorIndex", myCursorIndex)

        const secondQueryResults = R.slice(
          myCursorIndex,
          first + myCursorIndex + 1,
          filteredData,
        )
        console.log("secondQueryResults", secondQueryResults)

        const result = queryResults.map((person) => ({
          id: person.id,
          name: person.name,
          fromDate: person.fromDate,
          toDate: person.toDate,
          searchString: person.searchString,
          imageUrl: person.imageUrl,
          pricePerQty: person.pricePerQty,
          pageInfo: {
            endCursor: myCursor,
            hasNextPage: secondQueryResults.length >= first,
          },
        }))

        console.log("result", result)

        return result
      }

      return {
        pageInfo: {
          endCursor: null,
          hasNextPage: false,
        },
        persons: [],
      }
    },
  },
}

import { isWithinInterval, parseISO } from "date-fns"
import * as R from "ramda"

import { data } from "data"

export const resolvers = {
  Query: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    persons: (_parent, args, _context, _info) => {
      const {
        date,
        searchString,
        minPrice = 1000,
        maxPrice = 4000,
        sortOrder = "asc",
        cursor = 1,
        limit = 10,
      } = args

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

      const filteredData = filterData(
        date,
        searchString,
        minPrice,
        maxPrice,
        sortOrder,
      )

      const skip = (cursor - 1) * limit
      const take = cursor * limit
      return R.slice(skip, take, filteredData)
    },
  },
}

import { format } from "date-fns"

const initialStore = {
  date: format(new Date(), "yyyy-MM-dd"),
  searchString: "",
  minPrice: 1000,
  maxPrice: 4000,
  sortOrder: "asc",
  cursor: 1,
  limit: 10,
}

export default initialStore

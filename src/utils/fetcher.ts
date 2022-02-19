import request from "graphql-request"

const baseUrl = "http://localhost:3000/api/graphql"

export const fetcher = async (query, ...args) => {
  const res = await request(baseUrl, query, ...args)
  return res
}

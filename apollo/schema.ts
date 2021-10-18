import { makeExecutableSchema } from "@graphql-tools/schema"

import { typeDefs } from "apollo/type-defs"
import { resolvers } from "apollo/resolvers"

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

import { ApolloServer } from "apollo-server-micro"
import Cors from "micro-cors"

import { schema } from "apollo/schema"

const cors = Cors()
const apolloServer = new ApolloServer({ schema })
const startServer = apolloServer.start()

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res)
})

export const config = {
  api: {
    bodyParser: false,
  },
}

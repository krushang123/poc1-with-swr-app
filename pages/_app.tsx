import * as React from "react"
import { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import { ChakraProvider } from "@chakra-ui/react"
import "focus-visible/dist/focus-visible"

import { useApollo } from "apollo/client"

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp

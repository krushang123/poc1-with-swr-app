import * as React from "react"
import { Flex, Text } from "@chakra-ui/react"

const PersonDoc = () => (
  <Flex
    direction='column'
    justify='space-between'
    align='center'
    w='20rem'
    h='15rem'
    boxShadow='xl'
    p={10}
  >
    <Text>Person id</Text>
    <Text>Person Name</Text>
    <Text>Person Price</Text>
    <Text>Person FromDate</Text>
    <Text>Person ToDate</Text>
  </Flex>
)

export default PersonDoc

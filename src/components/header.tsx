import * as React from "react"
import { chakra, Flex } from "@chakra-ui/react"

import SearchBar from "src/components/search-bar"

const HeaderContent = ({ fallbackVariables }) => (
  <Flex h='10rem' align='center' justifyContent='center' w='full'>
    <SearchBar fallbackVariables={fallbackVariables} />
  </Flex>
)

const Header = ({ fallbackVariables }) => (
  <chakra.header
    w='100vw'
    pos='fixed'
    top='0'
    left='0'
    right='0'
    zIndex='sticky'
    bgColor='purple.100'
  >
    <HeaderContent fallbackVariables={fallbackVariables} />
  </chakra.header>
)

export default Header

import * as React from "react"
import NextImage from "next/image"
import { Box, Text } from "@chakra-ui/react"

const PersonCard = ({ person }) => (
  <Box w='20rem' h='22rem' boxShadow='md' rounded='lg'>
    <Box overflow='hidden'>
      <NextImage
        src={person.imageUrl}
        alt={person.id}
        width={400}
        height={300}
      />
    </Box>

    <Box p={4} fontWeight='bold'>
      <Text>{person.name}</Text>
      <Text>{person.searchString}</Text>
      <Text>{person.pricePerQty}</Text>
    </Box>
  </Box>
)

export default PersonCard

import * as React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import { Box, Button, HStack, Input } from "@chakra-ui/react"
import { Search2Icon } from "@chakra-ui/icons"

const SearchBar = ({ fallbackVariables }) => {
  const router = useRouter()

  const { data, mutate } = useSWR("globalState", {
    fallbackData: fallbackVariables,
  })

  const [date, setDate] = React.useState(data.date)
  const [searchString, setSearchString] = React.useState(data.searchString)

  return (
    <HStack px='3rem' py='1.5rem' spacing='5rem' bgColor='white' rounded='2xl'>
      <Box>
        <Input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          rounded='2xl'
        />
      </Box>

      <Box
        display='flex'
        w='20rem'
        borderWidth={1}
        p={2}
        rounded='2xl'
        alignItems='center'
      >
        <Search2Icon mx={4} />
        <Input
          type='text'
          placeholder='Enter search string'
          variant='unstyled'
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </Box>

      <Button
        colorScheme='purple'
        onClick={() => {
          router.push({
            pathname: "/",
            query: {
              ...data,
              date,
              searchString,
            },
          })

          mutate({ ...data, date, searchString })
        }}
      >
        Search
      </Button>
    </HStack>
  )
}

export default SearchBar

import * as React from "react"
import { GetServerSideProps } from "next"
import useSWR from "swr"
import { format } from "date-fns"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
  Grid,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react"

import Header from "components/header"
import PersonCard from "components/person-card"
// import FilterBar from "components/filter-bar"
import { GET_PERSONS } from "gql/queries"
import { fetcher } from "utils/fetcher"

const NoResultFound = () => (
  <Alert status='error'>
    <AlertIcon />
    <AlertTitle mr={2}>No Result Found!!</AlertTitle>
    <AlertDescription>
      Please search with different date and search string
    </AlertDescription>
  </Alert>
)

const Index = ({ fallbackData, fallbackVariables }) => {
  const ref = React.useRef(null)

  const [persons, setPersons] = React.useState([])

  const { data: filter, mutate } = useSWR("globalState", {
    fallbackData: fallbackVariables,
  })

  const {
    data,
    error,
    mutate: personMutate,
  } = useSWR([GET_PERSONS, filter], fetcher, {
    // onSuccess: (d) => {
    //   setPersons([...persons, ...d.persons])
    // },
    // fallbackData,
  })

  console.log("data", data)

  React.useMemo(() => {
    if (data) {
      setPersons([...persons, ...data.persons])
    }
  }, [data])

  const loadMore = React.useCallback(
    (entries) => {
      const target = entries[0]
      if (
        target.isIntersecting &&
        persons.length > 0 &&
        persons[persons.length - 1].pageInfo.hasNextPage
      ) {
        const lastPersonInResults = persons[persons.length - 1]
        const myCursor = lastPersonInResults.id

        mutate({ ...filter, afterCursor: myCursor }, false)
      }
    },
    [persons],
  )

  React.useEffect(() => {
    const options = {
      root: null, // window by default
      rootMargin: "0px",
      threshold: 0.25,
    }

    // Create observer
    const observer = new IntersectionObserver(loadMore, options)

    // observer the loader
    if (ref && ref.current) {
      observer.observe(ref.current)
    }

    // clean up on willUnMount
    return () => observer.unobserve(ref.current)
  }, [loadMore, ref])

  console.log("persons", persons)

  return (
    <Container id='content' maxW='100vw' p={0}>
      <Header fallbackVariables={fallbackVariables} />

      <Container
        as='main'
        centerContent
        maxW='100vw'
        p={0}
        minH='calc(100vh - 80px)'
        mt='10rem'
      >
        <Grid templateColumns='repeat(5, 1fr)' gap={10}>
          <GridItem colSpan={1}>
            {/* <FilterBar fallbackVariables={fallbackVariables} /> */}
          </GridItem>

          <GridItem colSpan={4}>
            <SimpleGrid mt='2rem' columns={3} spacing='2rem'>
              {persons?.map((person, index) => (
                <PersonCard key={index} person={person} />
              ))}
            </SimpleGrid>

            {persons?.length === 0 && <NoResultFound />}
          </GridItem>
        </Grid>

        <Box ref={ref} />
      </Container>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    date,
    searchString,
    minPrice,
    maxPrice,
    sortOrder,
    first,
    afterCursor,
  } = context.query

  const query = GET_PERSONS

  const variables = {
    date: date || format(new Date(), "yyyy-MM-dd"),
    searchString: searchString || "",
    minPrice: Number(minPrice) || 1000,
    maxPrice: Number(maxPrice) || 4000,
    sortOrder: sortOrder || "asc",
    first: Number(first) || 10,
    afterCursor: afterCursor || "",
  }

  const data = await fetcher(query, variables)

  return {
    props: { fallbackData: data, fallbackVariables: variables },
  }
}

export default Index

import * as React from "react"
import { GetServerSideProps } from "next"
import useSWRInfinite from "swr/infinite"
import { format } from "date-fns"
import useSWR from "swr"
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

import { GET_PERSONS } from "gql/queries"
import { fetcher } from "utils/fetcher"
import Header from "components/header"
import PersonCard from "components/person-card"
import FilterBar from "components/filter-bar"
import useInfiniteScroll from "hooks/useInfiniteScroll"

const mergePersons = (data) => data.flatMap((d) => d.persons)

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
  const [persons, setPersons] = React.useState(fallbackData || [])

  const { data: filter } = useSWR("globalState", {
    fallbackData: fallbackVariables,
  })

  const [intersecting, loadFinished, setLoadFinished] = useInfiniteScroll(ref)

  const getKey = (pageIndex, prevData) => {
    const prevPersons = prevData?.persons || []
    if (
      prevPersons &&
      prevPersons.length > 0 &&
      prevPersons.length < filter.limit
    ) {
      setLoadFinished(true)
      return null
    }

    return [
      GET_PERSONS,
      ...Object.entries(filter).flat(),
      "cursor",
      pageIndex + 1,
    ]
  }

  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    revalidateOnFocus: false,
  })

  const onLoadFinish = React.useCallback(() => {
    if (!loadFinished && intersecting) {
      setSize(size + 1)
    }
  }, [intersecting, loadFinished])

  React.useEffect(() => {
    if (data?.length) setPersons(mergePersons(data))
  }, [data])

  React.useEffect(() => {
    onLoadFinish()
  }, [onLoadFinish])

  if (error) console.error(error)

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
            <FilterBar fallbackVariables={fallbackVariables} />
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
  const { date, searchString, minPrice, maxPrice, sortOrder, cursor, limit } =
    context.query

  const query = GET_PERSONS

  const variables = {
    date: date || format(new Date(), "yyyy-MM-dd"),
    searchString: searchString || "",
    minPrice: Number(minPrice) || 1000,
    maxPrice: Number(maxPrice) || 4000,
    sortOrder: sortOrder || "asc",
    cursor: Number(cursor) || 1,
    limit: Number(limit) || 10,
  }

  const data = await fetcher(query, ...Object.entries(variables).flat())

  return {
    props: { fallbackData: data.persons, fallbackVariables: variables },
  }
}

export default Index

import * as React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  VStack,
  Heading,
  Radio,
  RadioGroup,
} from "@chakra-ui/react"

const PriceRange = ({ data, mutate }) => {
  const router = useRouter()

  const [minPrice, setMinPrice] = React.useState(data.minPrice)
  const [maxPrice, setMaxPrice] = React.useState(data.maxPrice)

  const onChangeEnd = (value: any[]) => {
    setMinPrice(value[0])
    setMaxPrice(value[1])

    router.push({
      pathname: "/",
      query: {
        ...data,
        minPrice: value[0],
        maxPrice: value[1],
      },
    })

    mutate({
      ...data,
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  return (
    <VStack w='full' alignItems='flex-start'>
      <Heading as='h2' mb={10}>
        Filter
      </Heading>

      <Text fontWeight='bold' fontSize='lg' mb={4}>
        Price
      </Text>

      <RangeSlider
        // eslint-disable-next-line jsx-a11y/aria-proptypes
        aria-label={["min", "max"]}
        size='lg'
        min={1000}
        max={4000}
        onChangeEnd={onChangeEnd}
        defaultValue={[data.minPrice, data.maxPrice]}
      >
        <RangeSliderTrack>
          <RangeSliderFilledTrack />
        </RangeSliderTrack>

        <RangeSliderThumb boxSize={8} index={0}>
          <Text>{minPrice}</Text>
        </RangeSliderThumb>

        <RangeSliderThumb boxSize={8} index={1}>
          <Text>{maxPrice}</Text>
        </RangeSliderThumb>
      </RangeSlider>
    </VStack>
  )
}

const SortPrice = ({ data, mutate }) => {
  const router = useRouter()

  const [sortOrder, setSortOrder] = React.useState(data.sortOrder)

  const onChange = (value: string) => {
    setSortOrder(value)

    router.push({
      pathname: "/",
      query: {
        ...data,
        sortOrder: value,
      },
    })

    mutate({ ...data, sortOrder: value })
  }

  return (
    <VStack w='full' alignItems='flex-start'>
      <Text fontWeight='bold' fontSize='lg' mb={2}>
        Sort Price
      </Text>

      <RadioGroup defaultValue={sortOrder} onChange={onChange}>
        <VStack>
          <Radio value='asc'>Low to High</Radio>
          <Radio value='desc'>High to Low</Radio>
        </VStack>
      </RadioGroup>
    </VStack>
  )
}

const FilterBar = ({ fallbackVariables }) => {
  const { data, mutate } = useSWR("globalState", {
    fallbackData: fallbackVariables,
  })

  return (
    <VStack
      w='20rem'
      h='25rem'
      p={10}
      spacing={16}
      borderWidth={1}
      boxShadow='lg'
      rounded='lg'
    >
      <PriceRange data={data} mutate={mutate} />
      <SortPrice data={data} mutate={mutate} />
    </VStack>
  )
}

export default FilterBar

'use client'

import {
  Box,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Image,
} from '@chakra-ui/react'

interface StatsCardProps {
  title: string
  stat: string
  icon: string
}

const StatsCard = ({ title, stat, icon }: StatsCardProps) => {
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.500', 'gray.500')}
      rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box
          my={'auto'}
          px={4}
          color={useColorModeValue('gray.800', 'gray.200')}
          alignContent={'center'}>
          <Image src={icon} alt={`${title} icon`} boxSize={['2em', '3em', '4em', '5em']}  />
        </Box>
      </Flex>
    </Stat>
  )
}

export default StatsCard

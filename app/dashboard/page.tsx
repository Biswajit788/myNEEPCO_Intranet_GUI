'use client'

import {
  Box,
  chakra,
  SimpleGrid,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import StatsCard from '@/components/StatsCard'
import Circular from '@/components/Circular'
import NewsUpdates from '@/components/NewsUpdates'

export default function DashboardPage() {
  return (
    <Box maxW="auto" mx={'auto'} px={{ base: 2, sm: 12, md: 17 }} height={'100vh'}>
      <chakra.h3 textAlign={'left'} fontSize={'lg'} py={4} mb={4}>
        Welcome to your Dashboard!
      </chakra.h3>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard title={'Hydro Power Station'} stat={'06'} icon={'/dam.png'} />
        <StatsCard title={'Thermal Power Station'} stat={'03'} icon={'/thermal.png'} />
        <StatsCard title={'Solar Power Station'} stat={'01'} icon={'/solar-energy.png'} />
      </SimpleGrid>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mt={12}>
        <GridItem>
          <NewsUpdates />
        </GridItem>
        <GridItem>
          <Circular />
        </GridItem>
      </Grid>
    </Box>
  )
}

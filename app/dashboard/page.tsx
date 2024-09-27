'use client'

import {
  Box,
  chakra,
  SimpleGrid,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react'
import StatsCard from '@/components/StatsCard'
import Circular from '@/components/Circular'
import NewsUpdates from '@/components/NewsUpdates'
import Birthday from '@/components/Birthday'
import data from '@/services/data';

export default function DashboardPage() {
  const people = data;
  return (
    <Box maxW="auto" mx="auto" px={{ base: 4, sm: 6, md: 8 }} height="auto">
      <chakra.h3 textAlign="left" fontSize="lg" py={4} mb={4}>
        Welcome to your Dashboard!
      </chakra.h3>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6, lg: 8 }}>
        <StatsCard title="Hydro Power Station" stat="06" icon="/dam.png" />
        <StatsCard title="Thermal Power Station" stat="03" icon="/thermal.png" />
        <StatsCard title="Solar Power Station" stat="01" icon="/solar-energy.png" />
      </SimpleGrid>

      <Grid
        templateColumns={{ base: '1fr', md: '1fr', lg: '1fr 2fr' }}
        gap={4}
        mt={8}
        mb={8}
      >
        <GridItem>
          <Birthday />
        </GridItem>

        <GridItem>
          <Grid templateColumns={{ base: '1fr', md: '1fr', lg: '1fr' }} gap={4}>
            <GridItem>
              <Circular />
            </GridItem>
            <GridItem>
              <NewsUpdates />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>

      <Box as="footer" bg="gray.700" color="white" py={4} textAlign="center">
        <Text fontSize="sm">
          © {new Date().getFullYear()} IT Department, NEEPCO LTD. All rights reserved.
        </Text>
      </Box>
    </Box>
  )
}

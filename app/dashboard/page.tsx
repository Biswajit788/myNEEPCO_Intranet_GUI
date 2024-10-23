'use client'

import {
  Box,
  chakra,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react'
import StatsCard from '@/components/StatsCard'
import Circular from '@/components/Circular'
import NewsUpdates from '@/components/NewsUpdates'
import Birthday from '@/components/Birthday'

export default function DashboardPage() {
  return (
    <Box maxW="auto" mx="auto" px={{ base: 2, sm: 2, md: 4 }} height="auto">
      <chakra.h3 textAlign="left" fontSize="lg" py={4} mb={2}>
        Welcome to your Dashboard!
      </chakra.h3>

      {/* Main content */}
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }} // Two equal columns for medium and up
        gap={4}
        mb={8}
      >
        {/* Circular and NewsUpdates side by side */}
        <GridItem>
          <Circular />
        </GridItem>

        <GridItem>
          <NewsUpdates />
        </GridItem>

        {/* Birthday on the bottom right */}
        <GridItem colSpan={{ base: 1, md: 2 }}  mt={6}>
          <Birthday />
        </GridItem>
      </Grid>

      {/* Footer */}
      <Box as="footer" bg="gray.700" color="white" py={4} textAlign="center">
        <Text fontSize="sm">
          © {new Date().getFullYear()} IT Department, NEEPCO LTD. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}

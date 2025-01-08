/* eslint-disable react/no-unescaped-entities */
'use client'

import {
  Box,
  chakra,
  Grid,
  GridItem,
  Text,
  Heading,
  UnorderedList,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react'
import StatsCard from '@/components/StatsCard'
import Circular from '@/components/Circular'
import NewsUpdates from '@/components/NewsUpdates'
import Birthday from '@/components/Birthday'
import Footer from '@/components/Footer'

export default function DashboardPage() {
  const colorHeaderText = useColorModeValue('blue.700', 'gray.300');
  const colorBodyText = useColorModeValue('gray.700', 'gray.300');
  return (
    <Box maxW="auto" mx="auto" px={{ base: 2, sm: 2, md: 4 }} height="auto">
      {/* Welcome Message */}
      <Box
        //bg="blue.50"
        p={4}
        mb={6}
        borderRadius="lg"
        border="1px solid"
        borderColor="blue.100"
      >
        <Heading size="sm" mb={4} color={colorHeaderText}>
          Welcome to the NEEPCO Intranet Portal
        </Heading>
        <Text fontSize="sm" color={colorBodyText} mb={4}>
          We're excited to have you here! This portal is your central hub for accessing company resources, staying informed about the latest updates.
        </Text>
      </Box>

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
        <GridItem colSpan={{ base: 1, md: 2 }} mt={6}>
          <Birthday />
        </GridItem>
      </Grid>

      {/* Footer */}
      <Box as="footer" bg="gray.700" color="white" py={4} textAlign="center">
        <Text fontSize="sm">
          © {new Date().getFullYear()} IT Department, Shillong, NEEPCO LTD. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
}

'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  chakra,
  Badge,
  Link as ChakraLink,
  useColorModeValue,
  Divider,
  Button,
  Flex,
  keyframes,
  Spinner,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation'; 
import { fetchCirculars } from '@/services/api';

// Marquee animation keyframes
const marquee = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
`;

// Define CircularData type
interface CircularData {
  id: string;
  attributes: {
    Title: string;
    CircularDt: string;
    File: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

// Function to check if the circular is recent (e.g., within the last 7 days)
const isNew = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  return diffInDays <= 7;
}

const Circular = () => {
  const [circulars, setCirculars] = useState<CircularData[]>([]);
  const [loading, setLoading] = useState(false); // Loading state

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const bgcolor = useColorModeValue('white', 'gray.900');
  const textcolor = useColorModeValue('gray.900', 'white');
  const router = useRouter(); // Use Next.js router

  // Memoized version of getCirculars to avoid re-creating the function on every render
  const getCirculars = useCallback(async () => {
    try {
      const response = await fetchCirculars();
      let data = Array.isArray(response.data) ? response.data : []; // Ensure it's an array

      // Sort the circulars by date in descending order and get the most recent 10
      data = data
        .sort((a: CircularData, b: CircularData) => new Date(b.attributes.CircularDt).getTime() - new Date(a.attributes.CircularDt).getTime())
        .slice(0, 10);

      setCirculars(data);
    } catch (error) {
      console.error('Error fetching circulars:', error);
    }
  }, []);

  useEffect(() => {
    getCirculars();
  }, [getCirculars]);

  // Memoize the rendered circulars to prevent re-renders
  const renderedCirculars = useMemo(() => {
    return Array.isArray(circulars) && circulars.length > 0 ? (
      circulars.map((circular) => (
        <Box
          key={circular.id}
          py={2}
          display="flex"
          alignItems="center"
          fontSize="12px"
          fontWeight="medium"
        >
          <ChakraLink
            as={NextLink}
            href={`${baseUrl}${circular.attributes.File?.data?.attributes?.url || '#'}`}
            isExternal
            download
            color={textcolor}
            _hover={{ textDecoration: 'underline' }}
          >
            {circular.attributes.Title}
          </ChakraLink>
          {isNew(circular.attributes.CircularDt) && (
            <Badge ml={2} colorScheme="green">
              New
            </Badge>
          )}
        </Box>
      ))
    ) : (
      <Box>No circulars available.</Box>
    );
  }, [circulars, baseUrl, textcolor]);

  const handleSeeAllClick = () => {
    setLoading(true); // Set loading state to true
    router.push('/dashboard/circular'); // Navigate to the circular page
  };

  return (
    <Box bg={bgcolor} p={4} rounded="md" shadow="md">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <chakra.h3 fontSize="md" fontWeight="bold">
          Circular/Notices
        </chakra.h3>
        {loading ? ( // Display spinner if loading
          <Spinner size="sm" />
        ) : (
          <Button size="sm" colorScheme="blue" onClick={handleSeeAllClick}>
            See All
          </Button>
        )}
      </Flex>
      <Divider />
      <Box overflow="hidden" position="relative" minH="200px">
        <Flex
          direction="column"
          animation={`${marquee} 15s linear infinite`}
        >
          {renderedCirculars}
        </Flex>
      </Box>
    </Box>
  );
}

export default React.memo(Circular);

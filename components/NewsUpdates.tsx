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
import { fetchUpdates } from '@/services/api';

// Marquee animation keyframes
const marquee = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
`;

// Define CircularData type
interface UpdateData {
  id: string;
  attributes: {
    Title: string;
    Dated: string;
    File: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

// Function to check if the Updates is recent (e.g., within the last 7 days)
const isNew = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  return diffInDays <= 7;
}

const NewsUpdates = () => {
  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [loading, setLoading] = useState(false); // Loading state

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const bgcolor = useColorModeValue('white', 'gray.900');
  const textcolor = useColorModeValue('gray.900', 'white');
  const router = useRouter(); // Use Next.js router

  // Memoized version of getCirculars to avoid re-creating the function on every render
  const getUpdates = useCallback(async () => {
    try {
      const response = await fetchUpdates();
      let data = Array.isArray(response.data) ? response.data : []; // Ensure it's an array

      // Sort the Updates by date in descending order and get the most recent 10
      data = data
        .sort((a: UpdateData, b: UpdateData) => new Date(b.attributes.Dated).getTime() - new Date(a.attributes.Dated).getTime())
        .slice(0, 10);

      setUpdates(data);
    } catch (error) {
      console.error('Error fetching Updates:', error);
    }
  }, []);

  useEffect(() => {
    getUpdates();
  }, [getUpdates]);

  // Memoize the rendered circulars to prevent re-renders
  const renderedUpdates = useMemo(() => {
    return Array.isArray(updates) && updates.length > 0 ? (
      updates.map((update) => (
        <Box
          key={update.id}
          py={2}
          display="flex"
          alignItems="center"
          fontSize="12px"
          fontWeight="medium"
        >
          <ChakraLink
            as={NextLink}
            href={`${baseUrl}${update.attributes.File?.data?.attributes?.url || '#'}`}
            isExternal
            download
            color={textcolor}
            _hover={{ textDecoration: 'underline' }}
          >
            {update.attributes.Title}
          </ChakraLink>
          {isNew(update.attributes.Dated) && (
            <Badge ml={2} colorScheme="green">
              New
            </Badge>
          )}
        </Box>
      ))
    ) : (
      <Box>No Latest update available.</Box>
    );
  }, [updates, baseUrl, textcolor]);

  const handleSeeAllClick = () => {
    setLoading(true); // Set loading state to true
    router.push('/dashboard/update'); // Navigate to the Updates page
  };

  return (
    <Box bg={bgcolor} p={4} rounded="md" shadow="md">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <chakra.h3 fontSize="md" fontWeight="bold">
          Latest Updates
        </chakra.h3>
        {loading ? ( // Display spinner if loading
          <Spinner size="sm" />
        ) : (
          <Button size="sm" variant="ghost" colorScheme="blue" onClick={handleSeeAllClick}>
            See All
          </Button>
        )}
      </Flex>
      <Divider />
      <Box overflow="hidden" position="relative" minH="200px">
        <Flex
          direction="column"
          animation={`${marquee} 5s linear infinite`}
        >
          {renderedUpdates}
        </Flex>
      </Box>
    </Box>
  );
}

export default React.memo(NewsUpdates);

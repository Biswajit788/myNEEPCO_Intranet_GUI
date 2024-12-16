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
  Spinner,
  List,
  ListItem,
  Icon,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';
import { fetchUpdates } from '@/services/api';
import { AttachmentIcon } from '@chakra-ui/icons'

// Marquee animation keyframes
const marquee = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
`;

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
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const titlebgcolor = useColorModeValue('gray.50', 'gray.900');
  const bgcolor = useColorModeValue('white', 'gray.900');
  const textcolor = useColorModeValue('blue.700', 'white');
  const router = useRouter();

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
    const openInSmallWindow = (url: string) => {
      if (url !== '#') {
        window.open(
          url,
          '_blank',
          'width=600,height=400,scrollbars=yes,resizable=yes'
        );
      }
    };

    return Array.isArray(updates) && updates.length > 0 ? (
      <List spacing={3}>
        {updates.map((update) => (
          <ListItem key={update.id} display="flex" alignItems="center" fontSize="13px">
            <Icon as={AttachmentIcon} boxSize={3} mr={2} color={textcolor} />
            <ChakraLink
              as="button"
              onClick={() => openInSmallWindow(`${baseUrl}${update.attributes.File?.data?.attributes?.url || '#'}`)}
              color={textcolor}
              _hover={{ textDecoration: 'underline' }}
              textAlign="left"
            >
              {update.attributes.Title}
            </ChakraLink>
            {isNew(update.attributes.Dated) && (
              <Badge ml={2} colorScheme="green">
                New
              </Badge>
            )}
          </ListItem>
        ))}
      </List>
    ) : (
      <Box>No Latest update available.</Box>
    );
  }, [updates, baseUrl, textcolor]);


  const handleSeeAllClick = () => {
    setLoading(true); // Set loading state to true
    router.push('/dashboard/update'); // Navigate to the Updates page
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg={titlebgcolor}
        p={2}
        shadow="md"
        borderTopRadius="md"
      >
        <chakra.h3 fontSize="md" fontWeight="bold" >
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
      {/* Box content comes after the Flex */}
      <Box
        h="360px"
        bg={bgcolor}
        p={4}
        shadow="md"
        border="1px"
        borderColor="gray.200"
      >
        <Box
          overflow="hidden"
          h="100%"
          onMouseEnter={() => { setIsHovered(true) }}
          onMouseLeave={() => { setIsHovered(false) }}
        >
          <Flex
            direction="column"
            animation={`${marquee} 20s linear infinite`}
            sx={{
              animationPlayState: isHovered ? 'paused' : 'running',
            }}
          >
            {renderedUpdates}
          </Flex>
        </Box>
      </Box >
    </>
  );
}

export default React.memo(NewsUpdates);

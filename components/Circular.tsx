'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  chakra,
  Badge,
  Link as ChakraLink,
  useColorModeValue,
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
import { fetchCirculars } from '@/services/api';
import { keyframes } from '@emotion/react';

// Marquee animation keyframes
const marquee = keyframes`
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
`;

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

// Check if a circular is new (within the last 7 days)
const isNew = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
  return diffInDays <= 7;
};

const Circular = () => {
  const [circulars, setCirculars] = useState<CircularData[]>([]);
  const [loading, setLoading] = useState(false);
  //const [isHovered, setIsHovered] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const titleBgColor = useColorModeValue('gray.50', 'gray.900');
  const bgColor = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('blue.700', 'white');
  const router = useRouter();

  const getCirculars = useCallback(async () => {
    let page = 1;
    const pageSize = 1000;
    let allCirculars: CircularData[] = [];
    setLoading(true);

    try {
      while (true) {
        const response = await fetchCirculars(page, pageSize);
        const data = Array.isArray(response.data) ? response.data : [];

        if (data.length === 0) break;

        allCirculars = [...allCirculars, ...data];
        page += 1;
      }

      const sortedData = allCirculars
        .sort((a, b) => new Date(b.attributes.CircularDt).getTime() - new Date(a.attributes.CircularDt).getTime())
        .slice(0, 10);

      setCirculars(sortedData);
    } catch (error) {
      console.error('Error fetching circulars:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCirculars();
  }, [getCirculars]);

  const renderedCirculars = useMemo(() => {
    const openInSmallWindow = (url: string) => {
      if (url !== '#') {
        window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
      }
    };

    return circulars.length > 0 ? (
      <List spacing={3}>
        {circulars.map((circular) => (
          <ListItem key={circular.id} display="flex" alignItems="center" fontSize="13px">
            <Icon as={AttachmentIcon} boxSize={3} mr={2} color={textColor} />
            <ChakraLink
              as="button"
              onClick={() => openInSmallWindow(`${baseUrl}${circular.attributes.File?.data?.attributes?.url || '#'}`)}
              color={textColor}
              _hover={{ textDecoration: 'underline' }}
              textAlign="left"
            >
              {circular.attributes.Title}
            </ChakraLink>
            {isNew(circular.attributes.CircularDt) && (
              <Badge ml={2} colorScheme="green">
                New
              </Badge>
            )}
          </ListItem>
        ))}
      </List>
    ) : (
      <Box>No circulars available.</Box>
    );
  }, [circulars, baseUrl, textColor]);

  const handleSeeAllClick = () => {
    setLoading(true);
    router.push('/dashboard/circular');
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg={titleBgColor}
        p={2}
        shadow="md"
        borderTopRadius="md"
      >
        <chakra.h3 fontSize="md" fontWeight="bold">
          Circular/Notices
        </chakra.h3>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <Button size="sm" variant="ghost" colorScheme="blue" onClick={handleSeeAllClick}>
            See All
          </Button>
        )}
      </Flex>

      <Box h="360px" bg={bgColor} p={4} shadow="md" border="1px" borderColor="gray.200">
        <Box
          overflow="hidden"
          h="100%"
          //onMouseEnter={() => setIsHovered(true)}
          //onMouseLeave={() => setIsHovered(false)}
        >
          <Flex
            direction="column"
            animation={`${marquee} 20s linear infinite`}
            sx={{
              //animationPlayState: isHovered ? 'paused' : 'running',
            }}
          >
            {renderedCirculars}
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(Circular);

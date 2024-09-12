"use client";
import { useEffect, useState } from 'react';
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  Text,
  useColorModeValue,
  Tooltip,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from '@chakra-ui/react';
import { PulseLoader } from 'react-spinners';
import { fetchPromotions } from '@/services/api';
import { DownloadIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';

interface FileData {
  url: string;
}

interface FileAttributes {
  data?: {
    attributes: FileData;
  };
}

interface PromotionAttributes {
  OrderNo: string;
  Grade: string;
  Dated: string;
  Remarks: string;
  createdAt: string;
  File?: FileAttributes;
}

interface Promotion {
  id: string | number;
  attributes: PromotionAttributes;
}

const ITEMS_PER_PAGE = 5;

export default function PromotionPage() {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const [loading, setLoading] = useState(false);
  const [promotionData, setPromotionData] = useState<Promotion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.900');
  const boxColor = useColorModeValue('gray.700', 'blue.900');
  const accordionBg = useColorModeValue('gray.100', 'gray.800');
  const accordionBorderColor = useColorModeValue('gray.300', 'gray.700');
  const headerBg = useColorModeValue('blue.700', 'gray.700');
  const textColor = useColorModeValue('white', 'white');
  const skewLoaderColor = useColorModeValue('blue', 'white');

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const getPromotions = async () => {
      try {
        setLoading(true);
        //await delay(1000); 
        const response = await fetchPromotions();
        if (response?.data) {
          setPromotionData(response.data as Promotion[]);
        }
      } catch (error: any) {
        if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
            setError('You are not authorized to view this page');
        } else {
            console.error('Failed to fetch accolades:', error);
            setError('Failed to fetch accolades. Please try again later.');
        }
    } finally {
        setLoading(false);
      }
    };

    getPromotions();
  }, []);

  const handleDownload = (fileUrl?: string) => {
    if (!fileUrl) {
      console.error('File URL is not defined');
      setError('File URL is not defined.');
      return;
    }

    const fullUrl = `${baseUrl}${fileUrl}`;

    const newWindow = window.open('', '_blank', 'width=600,height=400');

    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Downloading...</title>
          </head>
          <body>
            <p>Your download should start automatically. If it does not, <a href="${fullUrl}" download>click here</a>.</p>
            <script>
              window.onload = function() {
                window.location.href = "${fullUrl}";
              };
            </script>
          </body>
        </html>
      `);

      newWindow.document.close();
    } else {
      console.error('Failed to open new window');
      setError('Failed to open new window.');
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) {
      return 'Invalid date';
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    try {
      return new Date(dateString).toLocaleString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedData = promotionData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(promotionData.length / ITEMS_PER_PAGE);

  return (
    <Box minH="100vh" bg={bgColor} p={4}>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Flex justify="center" align="center" height="70vh"> {/* Center the loader */}
          <PulseLoader color={skewLoaderColor} />
        </Flex>
      ) : (
        <>
          <Box
            mb={8}
            p={4}
            bg={boxColor}
            color={textColor}
            borderRadius="sm"
            textAlign="center"
          >
            <Text fontWeight="bold">Congratulations to all promotees from the HR Team!</Text>
          </Box>
          <Box
            margin="0 auto"
            justifyContent={'center'}
            maxWidth="90%"
            border="1px solid gray"
            p={8}
          >
            <Accordion allowToggle>
              {paginatedData.map((promotion) => {
                const attributes = promotion.attributes;
                const fileUrl = attributes.File?.data?.attributes?.url;
                const createdAt = formatDateTime(attributes.createdAt);

                return (
                  <AccordionItem
                    key={promotion.id}
                    borderWidth="1px"
                    borderRadius="sm"
                    borderColor={accordionBorderColor}
                    bg={accordionBg}
                    mb={2}
                  >
                    <h2>
                      <AccordionButton
                        _expanded={{ bg: headerBg, color: textColor }}
                        py={2}
                        px={3}
                      >
                        <Box flex="1" textAlign="left">
                          <Heading as="h4" size="sm" fontSize="sm" fontWeight="lighter">
                            Order Number: {attributes.OrderNo}
                          </Heading>
                        </Box>
                        {fileUrl && (
                          <Tooltip label="Download">
                            <IconButton
                              aria-label="Download"
                              icon={<DownloadIcon />}
                              variant="link"
                              colorScheme="blue"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(fileUrl);
                              }}
                            />
                          </Tooltip>
                        )}
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text fontSize="xs">
                        <Text as="span" fontWeight="lighter">Grade:&nbsp;&nbsp;&nbsp;{attributes.Grade}</Text>
                      </Text>
                      <Text fontSize="xs">
                        <Text as="span" fontWeight="lighter">Order No:&nbsp;&nbsp;&nbsp;{attributes.OrderNo}</Text>
                      </Text>
                      <Text fontSize="xs">
                        <Text as="span" fontWeight="lighter">Dated:&nbsp;&nbsp;&nbsp;{attributes.Dated}</Text>
                      </Text>
                      <Text fontSize="xs">
                        <Text as="span" fontWeight="lighter">Remarks:&nbsp;&nbsp;&nbsp;{attributes.Remarks}</Text>
                      </Text>
                      <Text color="gray.500" fontSize="xs" textAlign="right">
                        Published on: {createdAt}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

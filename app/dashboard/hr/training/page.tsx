"use client";
import React from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    Flex,
    Heading,
    Text,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    useColorModeValue,
    Tooltip,
    IconButton,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    SimpleGrid,
    Skeleton,
    SkeletonText,
    Image,
    Stack,
    Divider,
} from '@chakra-ui/react';
import { fetchTraining } from '@/services/api';
import { DownloadIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';
import NoDataDisplay from '@/components/NoDataDisplay';

interface FileData {
    url: string;
}

interface FileAttributes {
    data: {
        attributes: FileData;
    };
}

interface TrainingAttributes {
    OrderNo: string;
    OrderDt: string;
    Title: string;
    TDate: string,
    createdAt: string;
    File?: FileAttributes;
}

interface Training {
    id: string | number;
    attributes: TrainingAttributes;
}

const ITEMS_PER_PAGE = 9;
const LOADING_TIME_MS = 0; // Time in milliseconds for skeleton display

// Memoize the Pagination component to avoid unnecessary re-renders
const MemoizedPagination = React.memo(Pagination);

export default function TrainingPage() {
    const [trainingData, setTrainingData] = useState<Training[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const bgColor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.300', 'gray.700');
    const headerBg = useColorModeValue('gray.500', 'gray.700');
    const textColor = useColorModeValue('white', 'white');

    useEffect(() => {
        const getTraining = async () => {
            try {
                const response = await fetchTraining();
                if (response?.data) {
                    setTrainingData(response.data as Training[]);
                }
            } catch (error: any) {
                if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
                    setError('You are not authorized to view this page');
                } else {
                    console.error('Failed to fetch training list:', error);
                    setError('Failed to fetch training list. Please try again later.');
                }
            } finally {
                setTimeout(() => setLoading(false), LOADING_TIME_MS);
            }
        };

        getTraining();
    }, []);

    // Memoize paginated data to avoid recalculating on each render
    const paginatedData = useMemo(() => {
        return trainingData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [trainingData, currentPage]);

    // Memoize the handlePageChange function to avoid re-creation on each render
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const totalPages = useMemo(() => {
        return Math.ceil(trainingData.length / ITEMS_PER_PAGE);
    }, [trainingData]);

    const handleDownload = useCallback((fileUrl?: string) => {
        if (!fileUrl) {
            console.error('File URL is not defined');
            setError('File URL is not defined.');
            return;
        }

        const fullUrl = `http://10.3.0.57:1337${fileUrl}`;
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
    }, []);

    const formatDateTime = useCallback((dateString?: string) => {
        if (!dateString) return 'Invalid date';

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
    }, []);

    return (
        <Box minH="100vh" bg={bgColor} p={2}>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle mr={2}>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Box
                mb={8}
                p={4}
                bg={boxColor}
                color={textColor}
                borderRadius="sm"
                textAlign="right"
            >
                <Text textTransform="uppercase">Training Announcement as on date</Text>
            </Box>

            {loading ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
                        <Card
                            key={index}
                            borderWidth="1px"
                            borderTopRadius="md"
                            borderBottomRadius="0"
                            overflow="hidden"
                            borderColor={cardBorderColor}
                            shadow="sm"
                            bg={cardBg}
                        >
                            <CardHeader bg={headerBg} py={2} px={3}>
                                <Flex justify="space-between" align="center">
                                    <Skeleton height="20px" width="60%" />
                                    <Skeleton height="20px" width="30%" />
                                </Flex>
                            </CardHeader>
                            <CardBody py={2} px={3}>
                                <SkeletonText mt="4" noOfLines={3} spacing="4" />
                            </CardBody>
                            <CardFooter py={2} px={3}>
                                <Flex justify="space-between" align="center">
                                    <Skeleton height="20px" width="20%" />
                                    <Skeleton height="20px" width="30%" />
                                </Flex>
                            </CardFooter>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : trainingData.length === 0 ? (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    minH="60vh"
                >
                    <NoDataDisplay />
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {paginatedData.map((training) => {
                        const attributes = training.attributes;
                        const fileUrl = attributes.File?.data?.attributes?.url;
                        const createdAt = formatDateTime(attributes.createdAt);

                        return (
                            <Card
                                key={training.id}
                                borderWidth="1px"
                                borderTopRadius="md"
                                borderBottomRadius="0"
                                overflow="hidden"
                                borderColor={cardBorderColor}
                                shadow="sm"
                                bg={cardBg}
                                transition="transform 0.2s ease-in-out"
                                _hover={{ transform: 'scale(1.05)' }}
                            >
                                <CardHeader bg={headerBg} py={2} px={3}>
                                    <Flex justify="space-between" align="center">
                                        <Text fontSize="sm" color="white">
                                            Order No: {attributes.OrderNo}
                                        </Text>
                                        <Text fontSize="sm" color="white">
                                            Dated: {attributes.OrderDt}
                                        </Text>
                                    </Flex>
                                </CardHeader>
                                <CardBody py={2} px={3}>
                                    
                                    <Stack mt='6' spacing='3'>
                                        <Text fontSize="xs">
                                        <span style={{ marginRight: '6px', fontWeight: 'bold', fontSize:'14px' }}>Topic:</span>{attributes.Title}
                                        </Text>
                                        <Divider/>
                                        <Text fontSize="xs">
                                        <span style={{ marginRight: '6px', fontWeight: 'bold', fontSize:'14px' }}>Training Date:</span>{attributes.TDate}
                                        </Text>
                                    </Stack>
                                </CardBody>
                                <Divider />
                                <CardFooter py={2} px={3} display="flex" alignItems="center" justifyContent="space-between">
                                    {fileUrl && (
                                        <Tooltip label="Download" fontSize="xs">
                                            <IconButton
                                                icon={<DownloadIcon />}
                                                aria-label="Download order"
                                                onClick={() => handleDownload(fileUrl)}
                                                variant="outline"
                                                size="md"
                                            />
                                        </Tooltip>
                                    )}
                                    <Text fontSize="x-small" color="gray.500" textAlign="right" w="100%">
                                        Published on: <Text as="span" display="block">{createdAt}</Text>
                                    </Text>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            )}

            <MemoizedPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </Box>
    );
}

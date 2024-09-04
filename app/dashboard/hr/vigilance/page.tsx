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
    Stack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    SimpleGrid,
    Skeleton,
    SkeletonText,
    StackDivider,
} from '@chakra-ui/react';
import { fetchVigilance } from '@/services/api';
import Pagination from '@/components/Pagination';
import NoDataDisplay from '@/components/NoDataDisplay';

interface FileData {
    url: string;
}

interface FileAttributes {
    data: {
        attributes: {
            url: string;
        };
    };
}

interface VigilanceAttributes {
    Title: string;
    Qtr: string,
    Year: string,
    createdAt: string;
    File1?: FileAttributes;
    File2?: FileAttributes;
}

interface Vigilance {
    id: string | number;
    attributes: VigilanceAttributes;
}

const ITEMS_PER_PAGE = 9;
const LOADING_TIME_MS = 0; // Time in milliseconds for skeleton display

// Memoize the Pagination component to avoid unnecessary re-renders
const MemoizedPagination = React.memo(Pagination);

export default function PromotionPage() {
    const [vigilanceData, setVigilanceData] = useState<Vigilance[]>([]);
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
        const getVigilance = async () => {
            try {
                const response = await fetchVigilance();
                if (response?.data) {
                    setVigilanceData(response.data as Vigilance[]);
                }
            } catch (error: any) {
                if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
                    setError('You are not authorized to view this page');
                } else {
                    console.error('Failed to fetch vigilance:', error);
                    setError('Failed to fetch vigilance. Please try again later.');
                }
            } finally {
                setTimeout(() => setLoading(false), LOADING_TIME_MS);
            }
        };

        getVigilance();
    }, []);

    // Memoize paginated data to avoid recalculating on each render
    const paginatedData = useMemo(() => {
        return vigilanceData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [vigilanceData, currentPage]);

    // Memoize the handlePageChange function to avoid re-creation on each render
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const totalPages = useMemo(() => {
        return Math.ceil(vigilanceData.length / ITEMS_PER_PAGE);
    }, [vigilanceData]);

    const handleDownload = useCallback((fileUrl: string | undefined) => {
        if (!fileUrl) {
            setError('File URL is not defined.');
            return;
        }

        const fullUrl = `http://10.3.0.57:1337${fileUrl}`;
        window.open(fullUrl, '_blank');
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
                <Text textTransform={'uppercase'}>Vigilance Clearance Report as on date</Text>
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
            ) : vigilanceData.length === 0 ? (
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
                    {paginatedData.map((vigilance) => {
                        const attributes = vigilance.attributes;
                        const fileUrlReport = attributes.File1?.data?.attributes?.url;
                        const fileUrlList = attributes.File2?.data?.attributes?.url;
                        const createdAt = formatDateTime(attributes.createdAt);

                        return (
                            <Card
                                key={vigilance.id}
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
                                        <Heading size="sm" color="white">
                                            {attributes.Qtr} {attributes.Year}
                                        </Heading>
                                    </Flex>
                                </CardHeader>
                                <CardBody py={2} px={3}>
                                    <Stack divider={<StackDivider />} spacing="4" mt={2}>
                                        <Box>
                                            <Heading size="xs" textTransform="uppercase">
                                                Report
                                            </Heading>
                                            <Text
                                                pt="2"
                                                fontSize="xs"
                                                fontStyle="italic"
                                                cursor={fileUrlReport ? 'pointer' : 'not-allowed'}
                                                onClick={() => fileUrlReport && handleDownload(fileUrlReport)}
                                                color={fileUrlReport ? 'blue.500' : 'gray.500'}
                                            >
                                                {fileUrlReport ? 'Click to download vigilance report' : 'Report not available'}
                                            </Text>
                                        </Box>
                                        <Box>
                                            <Heading size="xs" textTransform="uppercase">
                                                List
                                            </Heading>
                                            <Text
                                                pt="2"
                                                fontSize="sm"
                                                fontStyle="italic"
                                                cursor={fileUrlList ? 'pointer' : 'not-allowed'}
                                                onClick={() => fileUrlList && handleDownload(fileUrlList)}
                                                color={fileUrlList ? 'blue.500' : 'gray.500'}
                                            >
                                                {fileUrlList ? 'Click to download list of senior executive of E5 and above' : 'List not available'}
                                            </Text>
                                        </Box>
                                    </Stack>
                                </CardBody>
                                <CardFooter py={2} px={3} display="flex" alignItems="center" justifyContent="space-between">
                                    <Text fontSize="xs" color="gray.500" textAlign="right" w="100%">
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

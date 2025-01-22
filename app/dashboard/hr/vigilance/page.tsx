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
    Divider,
} from '@chakra-ui/react';
import { fetchVigilance } from '@/services/api';
import LastUpdated from '@/components/LastUpdated';
import Pagination from '@/components/Pagination';
import NoDataDisplay from '@/components/NoDataDisplay';
import Filter from '@/components/Filter';
import useDownload from '@/components/hooks/useDownload';

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
    Qtr: string;
    Year: string;
    updatedAt: string;
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

export default function VigilancePage() {

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const token = localStorage.getItem('token');
    const [vigilanceData, setVigilanceData] = useState<Vigilance[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [orderNo, setOrderNo] = useState<string | null>(null);
    const [orderDt, setOrderDt] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const bgColor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.300', 'gray.700');
    const headerBg = useColorModeValue('gray.500', 'gray.700');
    const textColor = useColorModeValue('white', 'white');

    useEffect(() => {
        const getVigilance = async () => {
            let page = 1;
            const pageSize = 1000;
            let allVigilances: Vigilance[] = [];
            setLoading(true);

            try {
                while (true) {
                    const response = await fetchVigilance(page, pageSize);
                    if (response?.data?.length === 0) {
                        break; // Exit the loop if no more data is returned
                    }
                    allVigilances = [...allVigilances, ...response.data];
                    page += 1
                }
                setVigilanceData(allVigilances);

                // Get the most recent updatedAt date for last updated display
                if (allVigilances.length > 0) {
                    const lastUpdatedDate = allVigilances
                        .map(vigilance => new Date(vigilance.attributes.updatedAt))
                        .reduce((latest, current) =>
                            current > latest ? current : latest,
                            new Date(0)
                        );

                    setLastUpdated(lastUpdatedDate.toISOString());
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

    // Memoized filtered and sorted data
    const filteredData = useMemo(() => {
        let data = [...vigilanceData];

        if (searchText) {
            data = data.filter((vigilance) => {
                const qtr = String(vigilance.attributes.Qtr).toLowerCase();
                const year = String(vigilance.attributes.Year).toLowerCase();

                return (
                    qtr.includes(searchText.toLowerCase()) ||
                    year.includes(searchText.toLowerCase())
                );
            });
        }

        // Apply filter by order number and date
        /*  if (orderNo) {
             data = data.filter((vigilance) =>
                 String(vigilance.attributes.orderNo).includes(orderNo)
             );
         }
 
         if (orderDt) {
             data = data.filter((vigilance) => vigilance.attributes.Dated === orderDt);
         }
  */
        // Apply sorting by date
        data.sort((a, b) => {
            const dateA = new Date(a.attributes.createdAt).getTime();
            const dateB = new Date(b.attributes.createdAt).getTime();

            return sortOrder === 'desc' ? dateA - dateB : dateB - dateA;
        });

        return data;
    }, [vigilanceData, searchText, sortOrder]);

    const paginatedData = useMemo(() => {
        return filteredData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredData, currentPage]);

    const handleSearch = useCallback((searchText: string) => {
        setSearchText(searchText);
        setCurrentPage(1);
    }, []);

    const handleFilter = useCallback((orderNo: string, orderDt: string) => {
        setOrderNo(orderNo);
        setOrderDt(orderDt);
        setCurrentPage(1);
    }, []);

    const handleReset = useCallback(() => {
        setSearchText('');
        setOrderNo(null);
        setOrderDt(null);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    }, [filteredData]);

    // Total number of filtered records
    const totalRecords = filteredData.length;

    const handleSorting = useCallback((sortOrder: 'desc' | 'asc') => {
        setSortOrder(sortOrder);
        setCurrentPage(1);
    }, []);

    //Download function hook handler
    const { handleDownload } = useDownload(baseUrl);

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

            {/* Filter Component */}
            <Filter
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSortByDate={handleSorting}
            />

            {/* Display Last Updated Date */}
            <LastUpdated lastUpdated={lastUpdated} />

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
            ) : filteredData.length === 0 ? (
                <Flex direction="column" align="center" justify="center" minH="50vh">
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
                                            {fileUrlReport ? (
                                                <Text
                                                    pt="2"
                                                    fontSize="xs"
                                                    fontStyle="italic"
                                                    cursor="pointer"
                                                    onClick={() => {
                                                        if (token) {
                                                            handleDownload(fileUrlReport, token);
                                                        } else {
                                                            console.error('User is not authenticated. Token is missing.');
                                                            alert('User is not Authenticated.')
                                                            setError('User is not authenticated.')
                                                        }
                                                    }}
                                                    color="blue.500"
                                                >
                                                    Click to download Vigilance Report
                                                </Text>
                                            ) : (
                                                <Text
                                                    pt="2"
                                                    fontSize="xs"
                                                    fontStyle="italic"
                                                    cursor="not-allowed"
                                                    color="gray.500"
                                                >
                                                    Report not available
                                                </Text>
                                            )}
                                        </Box>
                                        <Box>
                                            <Heading size="xs" textTransform="uppercase">
                                                List
                                            </Heading>
                                            {fileUrlList ? (
                                                <Text
                                                    pt="2"
                                                    fontSize="xs"
                                                    fontStyle="italic"
                                                    cursor="pointer"
                                                    onClick={() => {
                                                        if (token) {
                                                            handleDownload(fileUrlList, token);
                                                        } else {
                                                            console.error('User is not authenticated. Token is missing.');
                                                            alert('User is not Authenticated.')
                                                            setError('User is not authenticated.')
                                                        }
                                                    }}
                                                    color="blue.500"
                                                >
                                                    Click to download list of senior executive of E5 and above
                                                </Text>
                                            ) : (
                                                <Text
                                                    pt="2"
                                                    fontSize="xs"
                                                    fontStyle="italic"
                                                    cursor="not-allowed"
                                                    color="gray.500"
                                                >
                                                    List not available
                                                </Text>
                                            )}
                                        </Box>
                                    </Stack>
                                </CardBody>
                                <Divider />
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
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
            />
        </Box>
    );
}

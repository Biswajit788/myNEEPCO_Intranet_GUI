"use client";
import React from 'react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    Flex,
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
    Divider,
} from '@chakra-ui/react';
import { fetchSeniorities } from '@/services/api';
import { DownloadIcon } from '@chakra-ui/icons';
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
        attributes: FileData;
    };
}

interface SeniorityAttributes {
    OrderNo: string;
    OrderDt: string;
    Description: string;
    updatedAt: string;
    createdAt: string;
    File?: FileAttributes;
}

interface Seniority {
    id: string | number;
    attributes: SeniorityAttributes;
}

const ITEMS_PER_PAGE = 9;
const LOADING_TIME_MS = 0; // Time in milliseconds for skeleton display

// Memoize the Pagination component to avoid unnecessary re-renders
const MemoizedPagination = React.memo(Pagination);

export default function SeniorityPage() {

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const token = localStorage.getItem('token');
    const [seniorityData, setSeniorityData] = useState<Seniority[]>([]);
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
        const getSeniorities = async () => {
            let page = 1;
            const pageSize = 1000;
            let allSeniorities: Seniority[] = [];
            setLoading(true);

            try {
                while (true) {
                    const response = await fetchSeniorities(page, pageSize);

                    if (response?.data?.length === 0) {
                        break; // Stop fetching if no more seniorities
                    }

                    allSeniorities = [...allSeniorities, ...response.data];
                    page += 1; // Move to the next page
                }

                setSeniorityData(allSeniorities);

                // Get the most recent createdAt date for last updated display
                if (allSeniorities.length > 0) {
                    const lastUpdatedDate = allSeniorities
                        .map(seniority => new Date(seniority.attributes.updatedAt))
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
                    console.error('Failed to fetch seniority list:', error);
                    setError('Failed to fetch seniority list. Please try again later.');
                }
            } finally {
                setTimeout(() => setLoading(false), LOADING_TIME_MS);
            }
        };

        getSeniorities();
    }, []);


    // Memoized filtered and sorted data
    const filteredData = useMemo(() => {
        let data = [...seniorityData];

        if (searchText) {
            data = data.filter((seniority) => {
                const orderNo = String(seniority.attributes.OrderNo).toLowerCase();
                const description = String(seniority.attributes.Description).toLowerCase();

                return (
                    orderNo.includes(searchText.toLowerCase()) ||
                    description.includes(searchText.toLowerCase())
                );
            });
        }

        // Apply filter by order number and date
        if (orderNo) {
            data = data.filter((seniority) =>
                String(seniority.attributes.OrderNo).includes(orderNo)
            );
        }

        if (orderDt) {
            data = data.filter((seniority) => seniority.attributes.OrderDt === orderDt);
        }

        // Apply sorting by date
        data.sort((a, b) => {
            const dateA = new Date(a.attributes.OrderDt).getTime();
            const dateB = new Date(b.attributes.OrderDt).getTime();

            return sortOrder === 'desc' ? dateA - dateB : dateB - dateA;
        });

        return data;
    }, [seniorityData, searchText, orderNo, orderDt, sortOrder]);

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
                <Text textTransform={'uppercase'}>Release of Seniority as on date</Text>
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
                <SimpleGrid columns={{ base: 1, md: 1, lg: 2 }} spacing={4}>
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
            ) : seniorityData.length === 0 ? (
                <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    minH="60vh"
                >
                    <NoDataDisplay />
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    {paginatedData.map((seniority) => {
                        const attributes = seniority.attributes;
                        const fileUrl = attributes.File?.data?.attributes?.url;
                        const createdAt = formatDateTime(attributes.createdAt);

                        return (
                            <Card
                                key={seniority.id}
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
                                        <Text fontSize="small" color="white">
                                            Order No: {attributes.OrderNo}
                                        </Text>
                                        <Text fontSize="small" color="white">
                                            Dated: {attributes.OrderDt}
                                        </Text>
                                    </Flex>
                                </CardHeader>
                                <CardBody py={2} px={3}>
                                    <Flex fontSize="xs" mt={1}>
                                        <Text fontWeight="bold">Description:</Text>
                                        <Text ml={2}>{attributes.Description}</Text>
                                    </Flex>
                                </CardBody>
                                <Divider />
                                <CardFooter py={3} px={3} display="flex" alignItems="center" justifyContent="space-between">
                                    <Text fontSize="xs" color="gray.500" textAlign="left" w="100%">
                                        Published on: <Text as="span" display="block">{createdAt}</Text>
                                    </Text>
                                    {fileUrl && (
                                        <Tooltip label="Download" fontSize="xs">
                                            <IconButton
                                                onClick={() => {
                                                    if (token) {
                                                        handleDownload(fileUrl, token);
                                                    } else {
                                                        console.error('User is not authenticated. Token is missing.');
                                                        setError('User is not authenticated.')
                                                    }
                                                }}
                                                icon={<DownloadIcon />}
                                                aria-label="Download order"
                                                variant="outline"
                                                size="sm"
                                            />
                                        </Tooltip>
                                    )}
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

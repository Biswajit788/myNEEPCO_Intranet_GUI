"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    Flex,
    Text,
    SimpleGrid,
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
    Skeleton,
    SkeletonText,
} from '@chakra-ui/react';
import { fetchTransfers } from '@/services/api';
import { DownloadIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import NoDataDisplay from '@/components/NoDataDisplay';

interface FileData {
    url: string;
}

interface FileAttributes {
    data: {
        attributes: FileData;
    }[];
}

interface TransferAttributes {
    OrderNo: string;
    OrderDt: string;
    Description: string;
    createdAt: string;
    File?: FileAttributes;
}

interface Transfer {
    id: string | number;
    attributes: TransferAttributes;
}

const ITEMS_PER_PAGE = 9;
const LOADING_TIME_MS = 0;

const MemoizedPagination = React.memo(Pagination);

export default function PromotionPage() {

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const [transferData, setTransferData] = useState<Transfer[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [orderNo, setOrderNo] = useState<string | null>(null);
    const [orderDt, setOrderDt] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


    const bgColor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.300', 'gray.700');
    const headerBg = useColorModeValue('gray.500', 'gray.700');
    const textColor = useColorModeValue('white', 'white');

    useEffect(() => {
        const getTransfers = async () => {
            try {
                const response = await fetchTransfers();
                if (response?.data) {
                    setTransferData(response.data as Transfer[]);
                }
            } catch (error: any) {
                if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
                    setError('You are not authorized to view this page');
                } else {
                    console.error('Failed to fetch transfer list:', error);
                    setError('Failed to fetch transfer. Please try again later.');
                }
            } finally {
                setTimeout(() => setLoading(false), LOADING_TIME_MS);
            }
        };

        getTransfers();
    }, []);

    // Memoized filtered and sorted data
    const filteredData = useMemo(() => {
        let data = [...transferData];

        if (searchText) {
            data = data.filter((transfer) => {
                const orderNo = String(transfer.attributes.OrderNo).toLowerCase();
                const description = String(transfer.attributes.Description).toLowerCase();

                return (
                    orderNo.includes(searchText.toLowerCase()) ||
                    description.includes(searchText.toLowerCase())
                );
            });
        }

        // Apply filter by order number and date
        if (orderNo) {
            data = data.filter((transfer) =>
                String(transfer.attributes.OrderNo).includes(orderNo)
            );
        }

        if (orderDt) {
            data = data.filter((transfer) => transfer.attributes.OrderDt === orderDt);
        }

        // Apply sorting by date
        data.sort((a, b) => {
            const dateA = new Date(a.attributes.OrderDt).getTime();
            const dateB = new Date(b.attributes.OrderDt).getTime();

            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

        return data;
    }, [transferData, searchText, orderNo, orderDt, sortOrder]);

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

    const handleSorting = useCallback((sortOrder: 'asc' | 'desc') => {
        setSortOrder(sortOrder);
        setCurrentPage(1);
    }, []);

    const handleDownload = useCallback((fileUrl?: string) => {
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
    }, [baseUrl]);

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
                <Text textTransform="uppercase">Transfer and Posting as on date</Text>
            </Box>

            {/* Filter Component */}
            <Filter
                onSearch={handleSearch}
                onFilter={handleFilter}
                onSortByDate={handleSorting}
            />

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
            ) : transferData.length === 0 ? (
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
                    {paginatedData.map((transfer) => {
                        const attributes = transfer.attributes;
                        const fileUrl = attributes.File?.data[0]?.attributes?.url;
                        const createdAt = formatDateTime(attributes.createdAt);

                        return (
                            <Card
                                key={transfer.id}
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
                                    <Flex fontSize="xs" mt={1}>
                                        <Text fontWeight="bold">Description:</Text>
                                        <Text ml={2}>{attributes.Description}</Text>
                                    </Flex>
                                </CardBody>
                                <CardFooter py={2} px={3} display="flex" alignItems="center" justifyContent="space-between">
                                    {fileUrl && (
                                        <Tooltip label="Download" fontSize="xs">
                                            <IconButton
                                                icon={<DownloadIcon />}
                                                aria-label="Download order"
                                                onClick={() => handleDownload(fileUrl)}
                                                variant="outline"
                                                size="sm"
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
                totalRecords={totalRecords}
                onPageChange={handlePageChange}
            />
        </Box>
    );
}

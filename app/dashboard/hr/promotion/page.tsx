"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
} from '@chakra-ui/react';
import { fetchPromotions } from '@/services/api';
import { DownloadIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';
import Filter from '@/components/Filter';
import NoDataDisplay from '@/components/NoDataDisplay';

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

const ITEMS_PER_PAGE = 9;
const LOADING_TIME_MS = 0; // Time in milliseconds

// Memoize the Pagination component to avoid unnecessary re-renders
const MemoizedPagination = React.memo(Pagination);

export default function PromotionPage() {
    const [promotionData, setPromotionData] = useState<Promotion[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<Promotion[]>([]); // State for filtered data

    const bgColor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardBorderColor = useColorModeValue('gray.300', 'gray.700');
    const headerBg = useColorModeValue('gray.500', 'gray.700');
    const textColor = useColorModeValue('white', 'white');

    useEffect(() => {
        const getPromotions = async () => {
            try {
                const response = await fetchPromotions();
                if (response?.data) {
                    setPromotionData(response.data as Promotion[]);
                    setFilteredData(response.data as Promotion[]); // Initialize filteredData
                }
            } catch (error: any) {
                if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
                    setError('You are not authorized to view this page');
                } else {
                    console.error('Failed to fetch promotions:', error);
                    setError('Failed to fetch promotions. Please try again later.');
                }
            } finally {
                setTimeout(() => setLoading(false), LOADING_TIME_MS);
            }
        };

        getPromotions();
    }, []);

    const handleFilter = useCallback((orderNo: string, orderDt: string) => {
        const filtered = promotionData.filter((promotion) => {
            const promotionOrderNo = String(promotion.attributes.OrderNo);
            const matchesOrderNo = orderNo
                ? promotionOrderNo.includes(orderNo)
                : true;
            const matchesOrderDt = orderDt
                ? promotion.attributes.Dated === orderDt
                : true;

            return matchesOrderNo && matchesOrderDt;
        });
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page after filtering
    }, [promotionData]);

    const handleReset = useCallback(() => {
        setFilteredData(promotionData);
        setCurrentPage(1); // Reset to the first page after reset
    }, [promotionData]);

    // Memoize paginated data to avoid recalculating on each render
    const paginatedData = useMemo(() => {
        return filteredData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredData, currentPage]);

    // Memoize the handlePageChange function to avoid re-creation on each render
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    }, [filteredData]);

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
                <Text textTransform={'uppercase'}>
                    Congratulation to all the Promotees from the HR Team!
                </Text>
            </Box>

            {/* Filter Component */}
            <Filter onFilter={handleFilter} onReset={handleReset} />

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
            ) : promotionData.length === 0 ? (
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
                    {paginatedData.map((promotion) => {
                        const attributes = promotion.attributes;
                        const fileUrl = attributes.File?.data?.attributes?.url;
                        const createdAt = formatDateTime(attributes.createdAt);

                        return (
                            <Card
                                key={promotion.id}
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
                                            Dated: {attributes.Dated}
                                        </Text>
                                    </Flex>
                                </CardHeader>
                                <CardBody py={2} px={3}>
                                    <Flex fontSize="xs">
                                        <Text fontWeight="bold">Grade:</Text>
                                        <Text ml={2}>{attributes.Grade}</Text>
                                    </Flex>
                                    <Flex fontSize="xs" mt={1}>
                                        <Text fontWeight="bold">Remarks:</Text>
                                        <Text ml={2}>{attributes.Remarks}</Text>
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
                onPageChange={handlePageChange}
            />
        </Box>
    );
}

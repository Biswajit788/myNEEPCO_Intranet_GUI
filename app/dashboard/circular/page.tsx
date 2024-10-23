"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useColorModeValue,
    TableContainer,
    useBreakpointValue,
    Tooltip,
    IconButton,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    Text,
} from '@chakra-ui/react';
import { DownloadIcon, SearchIcon } from '@chakra-ui/icons';
import Pagination from '@/components/Pagination';
import { fetchCirculars } from '@/services/api';

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
    createdAt: string;
}

const CircularPage = () => {
    const [circulars, setCirculars] = useState<CircularData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const itemsPerPage = 10;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const bgcolor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const textColor = useColorModeValue('white', 'white');
    const tableVariant = useBreakpointValue({ base: 'striped', md: 'striped' });

    useEffect(() => {
        const loadCirculars = async () => {
            try {
                const data = await fetchCirculars();
                const circularsData = data.data || [];
                setCirculars(circularsData);
                setTotalRecords(circularsData.length);
                setTotalPages(Math.ceil(circularsData.length / itemsPerPage));

                // Get the most recent createdAt date for last updated display
                if (circularsData.length > 0) {
                    const lastUpdatedDate = circularsData[0]?.attributes?.createdAt;
                    setLastUpdated(lastUpdatedDate);
                }
            } catch (error: any) {
                if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
                    setError('You are not authorized to view this page');
                } else {
                    console.error('Failed to fetch circulars:', error);
                    setError('Failed to fetch circulars. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadCirculars();
    }, []);

    // Memoize filtered data
    const filteredCirculars = useMemo(() => {
        const filtered = circulars.filter(circular =>
            circular.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setTotalRecords(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        return filtered;
    }, [searchTerm, circulars]);

    // Function to handle download
    const handleDownload = useCallback((fileUrl?: string) => {
        if (!fileUrl) {
            console.error('File URL is not defined');
            setError('File URL is not defined.');
            return;
        }

        const fullUrl = `${baseUrl}${fileUrl}`;
        const newWindow = window.open('', '_blank', 'width=600,height=500');

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

    return (
        <Box bg={bgcolor} p={4} rounded="md" shadow="md">
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Box mb={{ base: 4, md: 8 }} p={4} bg={boxColor} color={textColor} borderRadius="sm" textAlign="left">
                <Text textTransform={'uppercase'} fontSize={{ base: 'sm', md: 'md' }}>
                    All Circular/Notice
                </Text>
            </Box>
            <Box display="flex" justifyContent="flex-start" width="100%" p={2}>
                <Box width={{ base: '100%', md: '40%' }}>
                    <InputGroup mb={0}>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search Circulars"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Box>
            </Box>
            {/* Display Last Updated Date */}
            <Box textAlign="right" fontSize="sm" fontStyle={'italic'} mb={2}>
                {lastUpdated && (
                    <Text color="gray.400">
                        Last Updated On: &nbsp;{new Date(lastUpdated).toLocaleDateString()}
                    </Text>
                )}
            </Box>
            {loading ? (
                <Box>
                    <Skeleton height="40px" mb={4} />
                    {Array(10)
                        .fill("")
                        .map((_, index) => (
                            <Skeleton key={index} height="40px" mb={4} />
                        ))}
                </Box>
            ) : (
                <TableContainer>
                    <Table variant={tableVariant} size="sm" borderWidth="1px">
                        <Thead>
                            <Tr>
                                <Th p={2}>Serial No</Th>
                                <Th p={2}>Description</Th>
                                <Th p={2}>Circular Date</Th>
                                <Th p={2}>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredCirculars
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((circular, index) => (
                                    <Tr key={circular.id}>
                                        <Td p={4}>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                                        <Td
                                            p={2}
                                            style={{
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {circular.attributes.Title}
                                        </Td>
                                        <Td p={2}>{new Date(circular.attributes.CircularDt).toLocaleDateString()}</Td>
                                        <Td p={2}>
                                            {circular.attributes.File?.data?.attributes?.url ? (
                                                <Tooltip label="Download" aria-label="Download">
                                                    <IconButton
                                                        onClick={() => handleDownload(circular.attributes.File?.data?.attributes?.url)}
                                                        icon={<DownloadIcon />}
                                                        colorScheme="blue"
                                                        size="sm"
                                                        aria-label="Download Circular"
                                                    />
                                                </Tooltip>
                                            ) : (
                                                'No File Available'
                                            )}
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
            <Pagination
                currentPage={currentPage}
                totalRecords={totalRecords}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </Box>
    );
};

export default CircularPage;

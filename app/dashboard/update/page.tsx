'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    chakra,
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
import NextLink from 'next/link';
import { fetchUpdates } from '@/services/api';
import Pagination from '@/components/Pagination';

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

const UpdatePage = () => {
    const [updates, setUpdates] = useState<UpdateData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const itemsPerPage = 10;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const bgcolor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const textColor = useColorModeValue('white', 'white');
    const tableVariant = useBreakpointValue({ base: 'striped', md: 'striped' });

    useEffect(() => {
        const loadUpdates = async () => {
            try {
                const data = await fetchUpdates();
                const updatesData = data.data || [];
                setUpdates(updatesData);
                setTotalRecords(updatesData.length);
                setTotalPages(Math.ceil(updatesData.length / itemsPerPage));
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

        loadUpdates();
    }, []);

    const filteredUpdates = useMemo(() => {
        const filtered = updates.filter(update =>
            update.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setTotalRecords(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        return filtered;
    }, [searchTerm, updates]);

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
                    Latest Updates
                </Text>
            </Box>
            <Box display="flex" justifyContent="flex-end" width="100%" p={2}>
                <Box
                    width={{
                        base: '100%',
                        md: '40%',
                    }}
                >
                    <InputGroup mb={4}>
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
                                <Th p={2}>Updated on</Th>
                                <Th p={2}>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredUpdates
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((circular, index) => (
                                    <Tr key={circular.id}>
                                        <Td p={2}>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                                        <Td p={2}>{circular.attributes.Title}</Td>
                                        <Td p={2}>
                                            {new Date(circular.attributes.Dated).toLocaleDateString()}
                                        </Td>
                                        <Td p={2}>
                                            <Tooltip label="Download" aria-label="Download">
                                                <IconButton
                                                    onClick={() => handleDownload(circular.attributes.File?.data?.attributes?.url)}
                                                    icon={<DownloadIcon />}
                                                    colorScheme="blue"
                                                    size="sm"
                                                    aria-label="Download Circular"
                                                />
                                            </Tooltip>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                onPageChange={setCurrentPage}
            />
        </Box>
    );
};

export default UpdatePage;

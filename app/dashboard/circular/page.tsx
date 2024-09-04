'use client'

import React, { useEffect, useState } from 'react';
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
    Divider,
} from '@chakra-ui/react';
import { DownloadIcon, SearchIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { fetchCirculars } from '@/services/api';
import Pagination from '@/components/Pagination';

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

const CircularPage = () => {
    const [circulars, setCirculars] = useState<CircularData[]>([]);
    const [filteredCirculars, setFilteredCirculars] = useState<CircularData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const itemsPerPage = 10;
    const bgcolor = useColorModeValue('white', 'gray.900');
    const tableVariant = useBreakpointValue({ base: 'striped', md: 'striped' });

    useEffect(() => {
        const loadCirculars = async () => {
            try {
                const data = await fetchCirculars();
                const circularsData = data.data || [];
                setCirculars(circularsData);
                setFilteredCirculars(circularsData);
                setTotalPages(Math.ceil(circularsData.length / itemsPerPage));
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

    useEffect(() => {
        const filtered = circulars.filter(circular =>
            circular.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCirculars(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    }, [searchTerm, circulars]);

    return (
        <Box bg={bgcolor} p={4} rounded="md" shadow="md">
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <chakra.h2 fontSize="lg" textTransform="uppercase" mb={4}>
                All Circulars/Notices
            </chakra.h2>
            <Divider />
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
                    <Table variant={tableVariant} size="sm">
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
                                        <Td p={2}>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                                        <Td p={2}>{circular.attributes.Title}</Td>
                                        <Td p={2}>
                                            {new Date(circular.attributes.CircularDt).toLocaleDateString()}
                                        </Td>
                                        <Td p={2}>
                                            <Tooltip label="Download" aria-label="Download">
                                                <IconButton
                                                    as={NextLink}
                                                    href={`${circular.attributes.File?.data?.attributes?.url || '#'}`}
                                                    target="_blank"
                                                    download
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
                onPageChange={setCurrentPage}
            />
        </Box>
    );
};

export default CircularPage;

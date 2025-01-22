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
import LastUpdated from '@/components/LastUpdated';
import Pagination from '@/components/Pagination';
import useDownload from '@/components/hooks/useDownload';

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
        updatedAt: string;
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
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const itemsPerPage = 10;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const token = localStorage.getItem('token');

    const bgcolor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const textColor = useColorModeValue('white', 'white');
    const tableVariant = useBreakpointValue({ base: 'striped', md: 'striped' });

    useEffect(() => {
        const loadUpdates = async () => {
            let page = 1;
            const pageSize = 1000;
            let allUpdates: UpdateData[] = [];
            setLoading(true);

            try {
                while (true) {
                    const response = await fetchUpdates(page, pageSize);

                    if (response?.data?.length === 0) {
                        break;
                    }
                    allUpdates = [...allUpdates, ...response.data];
                    page += 1;
                }

                setUpdates(allUpdates);
                setTotalRecords(allUpdates.length);
                setTotalPages(Math.ceil(allUpdates.length / itemsPerPage));

                // Get the most recent updatedAt date from the table
                if (allUpdates.length > 0) {
                    const lastUpdatedDate = allUpdates
                        .map(update => new Date(update.attributes.updatedAt))
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
                    console.error('Failed to fetch Notice & updates:', error);
                    setError('Failed to fetch Notice & updates. Please try again later.');
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

    //Download function hook handler
    const { handleDownload } = useDownload(baseUrl);

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
            <Box display="flex" justifyContent="flex-start" width="100%" p={2}>
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
                            placeholder="Search Updates"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Box>
            </Box>

            {/* Display Last Updated Date */}
            <LastUpdated lastUpdated={lastUpdated} />

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
                                .map((update, index) => (
                                    <Tr key={update.id}>
                                        <Td p={4}>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                                        <Td
                                            p={2}
                                            style={{
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {update.attributes.Title}
                                        </Td>
                                        <Td p={2}>
                                            {new Date(update.attributes.Dated).toLocaleDateString()}
                                        </Td>
                                        <Td p={2}>
                                            <Tooltip label="Download" aria-label="Download">
                                                <IconButton
                                                    onClick={() => {
                                                        if (token) {
                                                            handleDownload(update.attributes.File?.data?.attributes?.url, token);
                                                        } else {
                                                            console.error('User is not authenticated. Token is missing.');
                                                            setError('User is not authenticated.')
                                                        }
                                                    }}
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

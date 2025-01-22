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
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    SkeletonText,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { DownloadIcon, SearchIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { fetchForms } from '@/services/api';
import LastUpdated from '@/components/LastUpdated';
import Pagination from '@/components/Pagination';
import useDownload from '@/components/hooks/useDownload';

interface FormData {
    id: string;
    attributes: {
        Title: string;
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

const FormPage = () => {
    const [forms, setForms] = useState<FormData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const itemsPerPage = 10; // Number of items per page

    const bgcolor = useColorModeValue('white', 'gray.900');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const token = localStorage.getItem('token');

    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const textColor = useColorModeValue('white', 'white');
    const tableVariant = useBreakpointValue({ base: 'striped', md: 'striped' });

    useEffect(() => {
        const getForms = async () => {
            let page = 1;
            const pageSize = 1000;
            let allForms: FormData[] = [];
            setLoading(true);

            try {
                while (true) {
                    const response = await fetchForms(page, pageSize);

                    if (response?.data?.length === 0) {
                        break;
                    }

                    allForms = [...allForms, ...response.data];
                    page += 1;
                }

                setForms(allForms);
                setTotalRecords(allForms.length);
                setTotalPages(Math.ceil(allForms.length / itemsPerPage));

                // Get the most recent updated_at date for the table
                if (allForms.length > 0) {
                    const lastUpdatedDate = allForms
                        .map(form => new Date(form.attributes.updatedAt))
                        .reduce((latest, current) =>
                            current > latest ? current : latest,
                            new Date(0)
                        );

                    setLastUpdated(lastUpdatedDate.toISOString());
                }

            } catch (error) {
                setError('Error fetching Forms & Application data');
            } finally {
                setLoading(false);
            }
        };

        getForms();
    }, []);

    const filteredForms = useMemo(() => {
        const filtered = forms.filter(form =>
            form.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setTotalRecords(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        return filtered;
    }, [searchTerm, forms]);

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
            <Box
                mb={6}
                p={4}
                bg={boxColor}
                color={textColor}
                borderRadius="sm"
                textAlign="left"
            >
                <Text textTransform={'uppercase'}>
                    Forms / Application
                </Text>
            </Box>
            <Box display="flex" justifyContent="flex-start" width="100%">
                <Box
                    width={{
                        base: '100%',  // Full width on small screens
                        md: '40%'      // 40% width on medium and larger screens
                    }}
                >
                    <InputGroup mb={4}>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search Forms"
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
                    {/* Skeleton for table headers */}
                    <Skeleton height="40px" mb={4} />

                    {/* Skeleton for table rows */}
                    {Array(10)
                        .fill("")
                        .map((_, index) => (
                            <Skeleton key={index} height="40px" mb={4} />
                        ))}
                </Box>
            ) : (
                <TableContainer overflowX="auto">
                    <Table variant={tableVariant} size="sm" borderWidth="1px">
                        <Thead>
                            <Tr>
                                <Th p={2}>Serial No</Th>
                                <Th p={2}>Title</Th>
                                <Th p={2}>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredForms
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((form, index) => (
                                    <Tr key={form.id}>
                                        <Td p={2}>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                                        <Td p={2} whiteSpace="normal" wordBreak="break-word">
                                            {form.attributes.Title}
                                        </Td>
                                        <Td p={2}>
                                            <Tooltip label="Download" aria-label="Download">
                                                <IconButton
                                                    onClick={() => {
                                                        if (token) {
                                                            handleDownload(form.attributes.File?.data?.attributes?.url, token);
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

export default FormPage;

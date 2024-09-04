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
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    SkeletonText,
    Text,
} from '@chakra-ui/react';
import { DownloadIcon, SearchIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { fetchForms } from '@/services/api';
import Pagination from '@/components/Pagination';

// Define FormData type
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
    };
}

const FormPage = () => {
    const [forms, setForms] = useState<FormData[]>([]);
    const [filteredForms, setFilteredForms] = useState<FormData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const itemsPerPage = 10; // Number of items per page

    const bgcolor = useColorModeValue('white', 'gray.900');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const textColor = useColorModeValue('white', 'white');
    const tableVariant = useBreakpointValue({ base: 'striped', md: 'striped' });

    useEffect(() => {
        const getForms = async () => {
            try {
                const data = await fetchForms();
                const formsData = data.data || [];
                setForms(formsData);
                setFilteredForms(formsData);
                setTotalPages(Math.ceil(formsData.length / itemsPerPage));
            } catch (error) {
                setError('Failed to load forms & application');
            } finally {
                setLoading(false);
            }
        };

        getForms();
    }, []);

    useEffect(() => {
        const filtered = forms.filter(form =>
            form.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredForms(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Reset to first page on search
    }, [searchTerm, forms]);

    if (error) return <Box color="red.500">{error}</Box>;

    return (
        <Box bg={bgcolor} p={4} rounded="md" shadow="md">
            <Box
                mb={4}
                p={4}
                bg={boxColor}
                color={textColor}
                borderRadius="sm"
                textAlign="right"
            >
                <Text textTransform={'uppercase'}>
                    Forms & Application
                </Text>
            </Box>
            <Box display="flex" justifyContent="flex-end" width="100%">
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
                <TableContainer>
                    <Table variant={tableVariant} size="sm">
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
                                        <Td p={2}>{form.attributes.Title}</Td>
                                        <Td p={2}>
                                            <Tooltip label="Download" aria-label="Download">
                                                <IconButton
                                                    as={NextLink}
                                                    href={`${baseUrl}${form.attributes.File?.data?.attributes?.url || '#'}`}
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

export default FormPage;

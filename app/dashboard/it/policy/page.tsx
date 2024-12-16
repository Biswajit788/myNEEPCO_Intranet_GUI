"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select,
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
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
} from '@chakra-ui/react';
import { DownloadIcon, SearchIcon } from '@chakra-ui/icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import LastUpdated from '@/components/LastUpdated';
import Pagination from '@/components/Pagination';
import { fetchITPolicyData } from '@/services/api';

interface ItPolicyData {
    id: string;
    attributes: {
        Title: string;
        Category: string;
        File: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
        createdAt: string;
    };
}

const ITPolicyPage = () => {
    const [data, setData] = useState<ItPolicyData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>(''); // Add state for module filter

    const itemsPerPage = 10;
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const bgcolor = useColorModeValue('white', 'gray.900');
    const boxColor = useColorModeValue('gray.700', 'blue.900');
    const textColor = useColorModeValue('white', 'white');
    const tableVariant = useBreakpointValue({ base: 'striped', md: 'striped' });

    useEffect(() => {
        const loadData = async () => {
            let page = 1;
            const pageSize = 1000;
            let allData: ItPolicyData[] = [];
            setLoading(true);

            try {
                while(true) {
                    const response = await fetchITPolicyData(page, pageSize);

                    if(response?.data?.length === 0){
                        break;
                    }

                    allData = [...allData, ...response.data];
                    page += 1;
                }

                setData(allData);
                setTotalRecords(allData.length);
                setTotalPages(Math.ceil(allData.length / itemsPerPage));

                // Get the most recent createdAt date for last updated display
                if (allData.length > 0) {
                    const lastUpdatedDate = allData[0]?.attributes?.createdAt;
                    setLastUpdated(lastUpdatedDate);
                }
            } catch (error: any) {
                if (error?.response?.status === 401 && error?.response?.data?.message === 'Unauthorized') {
                    setError('You are not authorized to view this page');
                } else {
                    console.error('Failed to fetch accolades:', error);
                    setError('Failed to fetch accolades. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Memoize filtered data based on search term and selected module
    const filteredData = useMemo(() => {
        const filtered = data
            .filter((data) =>
                (data.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    data.attributes.Category.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedCategory === '' || data.attributes.Category === selectedCategory) // Filter by selected module
            );
        setTotalRecords(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        return filtered;
    }, [searchTerm, data, selectedCategory]);

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

    // Get unique modules for the module filter dropdown
    const uniqueCategories = Array.from(new Set(data.map((item) => item.attributes.Category)));

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
                    IT /Website /NCSP  Policy
                </Text>
            </Box>
            <Box display="flex" justifyContent="flex-start" width="100%" p={2}>
                <Box width={{ base: '100%', md: '40%' }}>
                    <InputGroup mb={0}>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.300" />
                        </InputLeftElement>
                        <Input
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Box>
            </Box>
            {/* Display Last Updated Date */}
            <LastUpdated lastUpdated={lastUpdated}/>

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
                                <Th p={2}>Title</Th>
                                <Th p={2} width="150px">
                                    <Box display="flex" alignItems="center">
                                        Category
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<BsThreeDotsVertical />}
                                                size="sm"
                                                ml={1}
                                                aria-label="Options"
                                                bg={'transparent'}
                                            />
                                            <MenuList bg={'gray.500'}>
                                                <Box p={2}>
                                                    <Select
                                                        //placeholder="Filter by Module"
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        bg={'white'}
                                                    >
                                                        <option value="">All Category</option>
                                                        {uniqueCategories.map((category, index) => (
                                                            <option key={index} value={category}>
                                                                {category}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </Box>
                                            </MenuList>
                                        </Menu>
                                    </Box>
                                </Th>
                                <Th p={2} textAlign={'center'}>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredData
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((data, index) => (
                                    <Tr key={data.id}>
                                        <Td p={4}>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                                        <Td
                                            p={2}
                                            style={{
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {data.attributes.Title}
                                        </Td>
                                        <Td p={2}>{data.attributes.Category}</Td>
                                        <Td p={2} width={150} textAlign={'center'}>
                                            {data.attributes.File?.data?.attributes?.url ? (
                                                <Tooltip label="Download" aria-label="Download">
                                                    <IconButton
                                                        onClick={() => handleDownload(data.attributes.File?.data?.attributes?.url)}
                                                        icon={<DownloadIcon />}
                                                        colorScheme="blue"
                                                        size="sm"
                                                        aria-label="Download Accolades"
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

export default ITPolicyPage;

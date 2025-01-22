"use client";
import { useState, useEffect } from 'react';
import {
    Box,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    Text,
    useColorModeValue,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { fetchIsoPdf } from '@/services/api';
import useDownload from '@/components/hooks/useDownload';

export default function IsoPage() {
    const [pdfData, setPdfData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const token = localStorage.getItem('token');
    const bgcolor = useColorModeValue('white', 'gray.900');
    const tableHeaderColor = useColorModeValue('gray.700', 'blue.900');
    const textColor = useColorModeValue('white', 'white');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const fetchPdf = async () => {
                try {
                    setLoading(true);
                    const data = await fetchIsoPdf();

                    if (data && data.data && data.data.length > 0) {
                        setPdfData(data.data);
                    } else {
                        setError('Error Fetching ISO document');
                    }
                } catch (err: any) {
                    console.error('Fetch PDF error:', err.message || err);
                    setError('Error fetching the PDF data');
                } finally {
                    setLoading(false);
                }
            };

            fetchPdf();
        }
    }, []);

    //Download function hook handler
    const { handleDownload } = useDownload(baseUrl);


    if (loading) {
        return <Spinner />;
    }

    return (
        <Box bg={bgcolor} p={4}>
            {error && (
                <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Box mb={{ base: 4, md: 8 }} p={4} bg={tableHeaderColor} color={textColor} borderRadius="sm" textAlign="left">
                <Text textTransform={'uppercase'} fontSize={{ base: 'sm', md: 'md' }}>
                    STATUS OF ACCREDITATION OF NEEPCO
                </Text>
            </Box>

            {/* Table to display ISO documents */}
            <Box
                width={{ base: '100%', md: '80%' }}
                bg={bgcolor}
                p={4}
                boxShadow="lg"
                borderRadius="md"
            >
                <Table variant="striped" size="sm">
                    <Thead>
                        <Tr>
                            <Th>Serial No.</Th>
                            <Th>Title</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {pdfData.map((item, index) => {
                            const title = item.attributes?.Title || 'Untitled Document';
                            const fileUrl = item.attributes?.File?.data?.attributes?.url;

                            return (
                                <Tr key={index}>
                                    <Td fontSize="sm">{index + 1}</Td>
                                    <Td fontSize="sm">{title}</Td>
                                    <Td fontSize="sm">
                                        {fileUrl ? (
                                            <IconButton
                                                onClick={() => {
                                                    if (token) {
                                                        handleDownload(fileUrl, token);
                                                    } else {
                                                        console.error('User is not authenticated. Token is missing.');
                                                        alert('User is not Authenticated')
                                                        setError('User is not authenticated.')
                                                    }
                                                }}
                                                icon={<DownloadIcon />}
                                                aria-label="Download PDF"
                                                borderRadius="50%"
                                            />
                                        ) : (
                                            <Text color="red.500" fontSize="sm">No File Available</Text>
                                        )}
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
}

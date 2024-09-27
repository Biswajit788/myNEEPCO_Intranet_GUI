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
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { fetchIsoPdf } from '@/services/api';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function IsoPage() {
    const [pdfData, setPdfData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                        setError('No data found in the response');
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

    const handleDownload = (fileUrl: string) => {
        const completeUrl = `${API_URL}${fileUrl}`;

        // Open a new window with the PDF file (small window)
        const newWindow = window.open(
            completeUrl,
            '_blank',
            'width=600,height=800,menubar=no,toolbar=no,status=no'
        );

        if (newWindow) {
            // Focus on the new window
            newWindow.focus();
        }
    };


    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <Box color="red.500">{error}</Box>;
    }

    return (
        <Box bg={bgcolor} p={4}>
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
                                                icon={<DownloadIcon />}
                                                aria-label="Download PDF"
                                                onClick={() => handleDownload(fileUrl)}
                                                borderRadius="50%"
                                            />
                                        ) : (
                                            <Text color="red.500" fontSize="sm">No File</Text>
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

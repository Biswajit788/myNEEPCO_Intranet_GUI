import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Flex, Skeleton, useColorModeValue, Tooltip, IconButton, VStack, HStack, Stack } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { FaRegHandPointRight } from "react-icons/fa";
import { useCallback } from 'react';

interface Rule {
    id: number;
    title: string;
    dated: string;
    fileUrl: string;
    file1Urls: string[];
}

interface RulesPageProps {
    rules: Rule[];
    title: string;
    heading: string;
    isLoading: boolean;
    error: string | null;
}

export default function RulesPage({ rules, title, heading, isLoading, error }: RulesPageProps) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const boxColor = useColorModeValue('gray.700', 'gray.600');
    const secondaryBoxColor = useColorModeValue('blue.600', 'gray.600');
    const titleColor = useColorModeValue('white', 'white');
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('black', 'gray.200');
    const tableBg = useColorModeValue('', 'gray.700');

    const handleDownload = useCallback((fileUrl?: string) => {
        if (!fileUrl) {
            console.error('File URL is not defined');
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
        }
    }, [baseUrl]);

    if (error) return <Text color="red.500">{error}</Text>;

    return (
        <>
            {/* Title Section */}
            <Skeleton isLoaded={!isLoading}>
                <Box mb={8} p={4} bg={boxColor} color={titleColor} borderRadius="sm">
                    <Text textTransform="uppercase" justifyContent="right" fontSize={{ base: 'md', md: 'lg' }}>{heading}</Text>
                </Box>
            </Skeleton>

            {/* Main Content */}
            <Flex direction={{ base: 'column', md: 'column', lg: 'row' }} justifyContent="space-between">
                {/* Existing Rules Table for larger screens and Cards for smaller screens */}
                <Box
                    width={{ base: '100%', md: '100%', lg: '60%' }}
                    bg={tableBg}
                    p={4}
                    mb={{ base: 4, md: 0 }}
                    borderRadius="md"
                    maxWidth="100%" // Set maxWidth to 100% to fit the screen
                >
                    <Skeleton isLoaded={!isLoading}>
                        <Box
                            mb={4}
                            p={2}
                            bg={secondaryBoxColor}
                            color={titleColor}
                            borderRadius="sm"
                        >
                            <Text fontSize={{ base: 'sm', md: 'md' }}>{title}</Text>
                        </Box>
                    </Skeleton>

                    {/* Use cards for small screens */}
                    <Skeleton isLoaded={!isLoading} height="auto">
                        <Box display={{ base: 'block', lg: 'none' }}>
                            <VStack spacing={4}>
                                {rules.length > 0 ? (
                                    rules.map((rule, index) => (
                                        <Box key={rule.id} p={4} boxShadow="md" borderRadius="md" width="100%">
                                            <Text color={textColor} fontSize="sm" mb={2}><span style={{ fontWeight: 'bold' }}>Serial No:</span> {index + 1}</Text>
                                            <Text color={textColor} fontSize="sm"><span style={{ fontWeight: 'bold' }}>Title:</span> {rule.title}</Text>
                                            <Text color={textColor} fontSize="sm"><span style={{ fontWeight: 'bold' }}>Dated:</span> {new Date(rule.dated).toLocaleDateString()}</Text>
                                            <HStack justifyContent="flex-end" mt={2}>
                                                <Tooltip label="Download" aria-label="View Tooltip">
                                                    <IconButton
                                                        icon={<DownloadIcon />}
                                                        aria-label="View"
                                                        size="sm"
                                                        onClick={() => handleDownload(rule.fileUrl)}
                                                        colorScheme="blue"
                                                    />
                                                </Tooltip>
                                            </HStack>
                                        </Box>
                                    ))
                                ) : (
                                    <Text color="gray.500" fontSize="sm">No rules found</Text>
                                )}
                            </VStack>
                        </Box>

                        {/* Table for larger screens */}
                        <Box display={{ base: 'none', lg: 'block' }}>
                            <Table variant="simple" size="md" borderWidth="1px" maxWidth="100%" overflowX="auto">
                                <Thead>
                                    <Tr>
                                        <Th color={textColor} fontSize="sm">Sl No</Th>
                                        <Th color={textColor} fontSize="sm">Title</Th>
                                        <Th color={textColor} fontSize="sm">Dated</Th>
                                        <Th color={textColor} fontSize="sm">Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {rules.length > 0 ? (
                                        rules.map((rule, index) => (
                                            <Tr key={rule.id}>
                                                <Td color={textColor} fontSize="sm">{index + 1}</Td>
                                                <Td color={textColor} fontSize="sm">{rule.title}</Td>
                                                <Td color={textColor} fontSize="sm">{new Date(rule.dated).toLocaleDateString()}</Td>
                                                <Td>
                                                    <Tooltip label="Download" aria-label="View Tooltip">
                                                        <IconButton
                                                            icon={<DownloadIcon />}
                                                            aria-label="View"
                                                            size="sm"
                                                            onClick={() => handleDownload(rule.fileUrl)}
                                                            colorScheme="blue"
                                                        />
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={4}>
                                                <Text color="gray.500" fontSize="sm">No rules found</Text>
                                            </Td>
                                        </Tr>
                                    )}
                                </Tbody>
                            </Table>
                        </Box>
                    </Skeleton>
                </Box>

                {/* Amendment Section */}
                <Box
                    width={{ base: '100%', md: '48%' }}
                    bg={tableBg}
                    p={4}
                    borderRadius="md"
                >
                    <Skeleton isLoaded={!isLoading}>
                        <Box
                            mb={6}
                            p={2}
                            bg={secondaryBoxColor}
                            color={titleColor}
                            borderRadius="sm"
                        >
                            <Text fontSize={{ base: 'sm', md: 'md' }}>Amendment</Text>
                        </Box>
                    </Skeleton>

                    <Skeleton isLoaded={!isLoading}>
                        <Flex direction="column">
                            {rules.length > 0 ? (
                                rules.map((rule) => (
                                    <Box key={`amendment-${rule.id}`} mb={2}>
                                        {rule.file1Urls && rule.file1Urls.length > 0 ? (
                                            <>
                                                <Text fontSize={{ base: 'xs', md: 'sm' }} mb={4}>
                                                    Click on the links to view amendments:
                                                </Text>
                                                <ol style={{ paddingLeft: '20px' }}>
                                                    {rule.file1Urls.map((fileUrl, index) => (
                                                        <li key={`file-${index}`}>
                                                            <a
                                                                href='javascript:void(0);'
                                                                onClick={() => handleDownload(fileUrl)}
                                                                download
                                                                style={{
                                                                    color: 'blue',
                                                                    fontSize: '14px',
                                                                    textDecoration: 'underline',
                                                                    fontStyle: 'italic',
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <FaRegHandPointRight style={{ marginRight: '5px' }} />
                                                                Click here for Amendment No. {index + 1}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ol>
                                            </>
                                        ) : (
                                            <Text color="red.500" fontSize={{ base: 'xs', md: 'sm' }} fontStyle={'italic'}>No amendment available</Text>
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Text color="gray.500" fontSize={{ base: 'xs', md: 'sm' }}>No amendments found</Text>
                            )}
                        </Flex>
                    </Skeleton>
                </Box>

            </Flex>
        </>
    );
}

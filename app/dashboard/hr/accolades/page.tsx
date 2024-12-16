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
import LastUpdated from '@/components/LastUpdated';
import { fetchAccolades } from '@/services/api';

interface AccoladesData {
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
    createdAt: string;
  };
}

const AccoladesPage = () => {
  const [accolades, setAccolades] = useState<AccoladesData[]>([]);
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
    const loadAccolades = async () => {
      let page = 1;
      const pageSize = 1000;
      let allAccolades: AccoladesData[] = [];
      setLoading(true);

      try {
        while (true) {
          const response = await fetchAccolades(page, pageSize);

          if (response?.data?.length === 0) {
            break;
          }

          allAccolades = [...allAccolades, ...response.data];
          page += 1;
        }

        setAccolades(allAccolades);
        setTotalRecords(allAccolades.length);
        setTotalPages(Math.ceil(allAccolades.length / itemsPerPage));

        // Get the most recent createdAt date for last updated display
        if (allAccolades.length > 0) {
          const lastUpdatedDate = allAccolades[0]?.attributes?.createdAt;
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

    loadAccolades();
  }, []);

  // Memoize filtered data
  const filteredAccolades = useMemo(() => {
    const filtered = accolades.filter(accolade =>
      accolade.attributes.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTotalRecords(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    return filtered;
  }, [searchTerm, accolades]);

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
          Accolades
        </Text>
      </Box>
      <Box display="flex" justifyContent="flex-start" width="100%" p={2}>
        <Box width={{ base: '100%', md: '40%' }}>
          <InputGroup mb={0}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search Accolades"
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
                <Th p={2}>Title</Th>
                <Th p={2} textAlign={'center'}>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredAccolades
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((accolade, index) => (
                  <Tr key={accolade.id}>
                    <Td p={4}>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                    <Td
                      p={2}
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {accolade.attributes.Title}
                    </Td>
                    <Td p={2} width={150} textAlign={'center'}>
                      {accolade.attributes.File?.data?.attributes?.url ? (
                        <Tooltip label="Download" aria-label="Download">
                          <IconButton
                            onClick={() => handleDownload(accolade.attributes.File?.data?.attributes?.url)}
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

export default AccoladesPage;

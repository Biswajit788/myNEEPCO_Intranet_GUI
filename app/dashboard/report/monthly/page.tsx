'use client';

import { useState } from 'react';
import { Box, Button, VStack, HStack, Select, Text, Table, Thead, Tbody, Tr, Th, Td, useToast, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { fetchMonthlyGenerationReport } from '@/services/api'; // Update your API service
import useDownload from '@/components/hooks/useDownload';

interface FileData {
  id: number;
  name: string;
  url: string;
}

interface ReportData {
  id: number;
  Title: string;
  Month: string;
  Year: string;
  File?: FileData; // File is optional
}

const getCurrentMonth = () => MONTHS[new Date().getMonth()];

const getCurrentYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  return year;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


const MonthlyGenerationReport = () => {
  const toast = useToast();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const token = localStorage.getItem('token');

  const [month, setMonth] = useState<string>(getCurrentMonth());
  const [year, setYear] = useState<string>(String(getCurrentYear()));
  const [data, setData] = useState<ReportData[] | null>(null);

  const boxColor = useColorModeValue('gray.700', 'blue.900');
  const titleColor = useColorModeValue('gray.200', 'gray.500');
  const textColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleFetchData = async () => {
    if (!month || !year) {
      window.alert('Please select both month and year.');
      return;
    }

    try {
      const data = await fetchMonthlyGenerationReport(month, year); // Update your API service to handle month and year
      let reportsData = data || [];

      if (reportsData.length === 0) {
        toast({
          title: "Report not available.",
          description: `No report available for ${month}, ${year}`,
          status: "warning",
          position: "bottom",
          duration: 2000,
          isClosable: true,
        });
      }

      setData(reportsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
    }
  };

  //Download function hook handler
  const { handleDownload } = useDownload(baseUrl);

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" p={{ base: 3, md: 5 }}>
      {/* First Box - Month and Year Selection and Fetch */}
      <Box borderWidth="1px" p={{ base: 3, md: 4 }}>
        <Box mb={{ base: 4, md: 8 }} p={4} bg={boxColor} color={textColor} borderRadius="sm" textAlign="left">
          <Text textTransform={'uppercase'} fontSize={{ base: 'sm', md: 'md' }}>
            Monthly Generation Status
          </Text>
        </Box>
        <HStack spacing={{ base: 2, md: 3 }} flexDirection={{ base: 'column', md: 'row' }} alignItems="center">
          <Text fontStyle="regular" fontSize="sm">Select Month:</Text>
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            width={{ base: 'full', md: 'auto' }}
            fontSize="sm"
          >
            {MONTHS.map((month, index) => (
              <option key={index + 1} value={month}>
                {month}
              </option>
            ))}
          </Select>
          <Text fontStyle="regular" fontSize="sm">Select Year:</Text>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            width={{ base: 'full', md: 'auto' }}
            fontSize="sm"
          >
            {Array.from({ length: 10 }, (_, i) => getCurrentYear() - i).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="gray"
            size="sm"
            variant="outline"
            onClick={handleFetchData}
            width={{ base: 'full', md: 'auto' }}
            ml={{ base: 0, md: 4 }}
            flexShrink={0}
            leftIcon={<SearchIcon />}
          >
            Fetch data
          </Button>
        </HStack>
      </Box>

      {/* Second Box - Display Result and Download */}
      <Box p={{ base: 3, md: 4 }}>
        <Box
          mb={{ base: 4, md: 8 }}
          p={2}
          bg={titleColor}
          color={'black'}
          borderRadius="sm"
          textAlign="left"
        >
          <Text textTransform={'uppercase'} fontSize={{ base: 'sm', md: 'md' }}>Report</Text>
        </Box>
        {data && data.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" borderWidth="1px" borderColor={borderColor}>
              <Thead>
                <Tr>
                  <Th borderColor={borderColor}>Sl. No</Th>
                  <Th borderColor={borderColor}>Title</Th>
                  <Th borderColor={borderColor}>Month</Th>
                  <Th borderColor={borderColor}>Year</Th>
                  <Th borderColor={borderColor}>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={item.id}>
                    <Td borderColor={borderColor}>{index + 1}</Td>
                    <Td borderColor={borderColor}>{item.Title}</Td>
                    <Td borderColor={borderColor}>{item.Month}</Td>
                    <Td borderColor={borderColor}>{item.Year}</Td>
                    <Td borderColor={borderColor}>
                      {item.File ? (
                        <Button
                          colorScheme="blue"
                          size="xs"
                          onClick={() => {
                            if (token) {
                              handleDownload(item.File?.url, token);
                            } else {
                              console.error('User is not authenticated. Token is missing.');
                              alert('User is not Authenticated.')
                            }
                          }}
                        >
                          Download
                        </Button>
                      ) : (
                        'No file available'
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box
            fontStyle="regular"
            fontSize="sm"
            color={'blue.500'}
          >
            No data available. Please fetch the report.
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default MonthlyGenerationReport;

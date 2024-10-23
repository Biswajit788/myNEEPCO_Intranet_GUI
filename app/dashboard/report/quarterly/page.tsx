'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Select,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { fetchQuarterlyGenerationReport } from '@/services/api'; // Update your API service

interface FileData {
  id: number;
  name: string;
  url: string;
}

interface ReportData {
  id: number;
  Title: string;
  Quarter: string;
  Year: string;
  File?: FileData; // File is optional
}

const getCurrentQuarter = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 1 && month <= 3) return 'Jan-Mar';
  if (month >= 4 && month <= 6) return 'Apr-Jun';
  if (month >= 7 && month <= 9) return 'Jul-Sep';
  return 'Oct-Dec';
};

const getCurrentYear = () => new Date().getFullYear();

const QUARTERS = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];

const QuarterlyGenerationReport = () => {
  const toast = useToast();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const [quarter, setQuarter] = useState<string>(getCurrentQuarter());
  const [year, setYear] = useState<string>(String(getCurrentYear()));
  const [data, setData] = useState<ReportData[] | null>(null);

  const boxColor = useColorModeValue('gray.700', 'blue.900');
  const titleColor = useColorModeValue('gray.200', 'gray.500');
  const textColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleFetchData = async () => {
    if (!quarter || !year) {
      window.alert('Please select both quarter and year.');
      return;
    }

    try {
      const data = await fetchQuarterlyGenerationReport(quarter, year); // Ensure this API handles quarter and year
      const reportsData = data || [];

      if (reportsData.length === 0) {
        toast({
          title: 'Report not available.',
          description: `No report available for ${quarter}, ${year}`,
          status: 'warning',
          position: 'bottom',
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

  const downloadFile = async (fileUrl: string, fileName: string) => {
    const fullUrl = `${baseUrl}${fileUrl}`;

    try {
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch" p={{ base: 3, md: 5 }}>
      {/* First Box - Quarter and Year Selection and Fetch */}
      <Box borderWidth="1px" p={{ base: 3, md: 4 }}>
        <Box
          mb={{ base: 4, md: 8 }}
          p={4}
          bg={boxColor}
          color={textColor}
          borderRadius="sm"
          textAlign="left"
        >
          <Text textTransform={'uppercase'} fontSize={{ base: 'sm', md: 'md' }}>
            Quarterly Generation Status
          </Text>
        </Box>
        <HStack
          spacing={{ base: 2, md: 3 }}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text fontStyle="regular" fontSize="sm">
            Select Quarter:
          </Text>
          <Select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            width={{ base: 'full', md: 'auto' }}
            fontSize="sm"
          >
            {QUARTERS.map((qtrName, index) => (
              <option key={index + 1} value={qtrName}>
                {qtrName}
              </option>
            ))}
          </Select>
          <Text fontStyle="regular" fontSize="sm">
            Select Year:
          </Text>
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
        <Box mb={{ base: 4, md: 8 }} p={2} bg={titleColor} color={'black'} borderRadius="sm" textAlign="left">
          <Text textTransform={'uppercase'} fontSize={{ base: 'sm', md: 'md' }}>
            Report
          </Text>
        </Box>
        {data && data.length > 0 ? (
          <Box overflowX="auto">
            <Table variant="simple" borderWidth="1px" borderColor={borderColor}>
              <Thead>
                <Tr>
                  <Th borderColor={borderColor}>Sl. No</Th>
                  <Th borderColor={borderColor}>Title</Th>
                  <Th borderColor={borderColor}>Quarter</Th>
                  <Th borderColor={borderColor}>Year</Th>
                  <Th borderColor={borderColor}>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={item.id}>
                    <Td borderColor={borderColor}>{index + 1}</Td>
                    <Td borderColor={borderColor}>{item.Title}</Td>
                    <Td borderColor={borderColor}>{item.Quarter}</Td>
                    <Td borderColor={borderColor}>{item.Year}</Td>
                    <Td borderColor={borderColor}>
                      {item.File ? (
                        <Button
                          colorScheme="blue"
                          size="xs"
                          onClick={() => downloadFile(item.File?.url || '', item.File?.name || 'unknown-file')}
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
          <Box fontStyle="regular" fontSize="sm" color={'blue.500'}>
            No data available. Please fetch the report.
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default QuarterlyGenerationReport;

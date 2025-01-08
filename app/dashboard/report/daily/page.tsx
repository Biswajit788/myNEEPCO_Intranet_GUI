'use client';

import { useState } from 'react';
import { Box, Button, VStack, Heading, Input, HStack, Flex, Table, Thead, Tbody, Tr, Th, Td, Text, useToast, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { fetchDailyGenerationReport } from '@/services/api';
import useDownload from '@/components/hooks/useDownload';

interface FileData {
  id: number;
  name: string;
  url: string;
}

interface ReportData {
  id: number;
  Title: string;
  Dated: string;
  File?: FileData; // File is optional
}

const getCurrentDateForInput = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${year}-${month}-${day}`; // yyyy-mm-dd format for the input field
};

const DailyGenerationReport = () => {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const token = localStorage.getItem('token');
  const toast = useToast();
  const [date, setDate] = useState<string>(getCurrentDateForInput());
  const [data, setData] = useState<ReportData[] | null>(null);

  const boxColor = useColorModeValue('gray.700', 'blue.900');
  const titleColor = useColorModeValue('gray.200', 'gray.500');
  const textColor = useColorModeValue('white', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleFetchData = async () => {
    if (!date) {
      window.alert('Please select a date.');
      return;
    }

    try {
      const data = await fetchDailyGenerationReport(date);
      let reportsData = data || [];

      // Optionally filter data by date if needed (Client side)
      // reportsData = reportsData.filter((item: ReportData) => item.Dated === date);
      if (reportsData.length === 0) {
        // Show toast when no data is available
        toast({
          title: "Report not available.",
          description: `No report available for ${date}`,
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
      {/* First Box - Date Selection and Fetch */}
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
            Daily Generation Status
          </Text>
        </Box>
        <HStack
          spacing={{ base: 2, md: 3 }}
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems="center"
        >
          <Text
            fontStyle="regular"
            size="sm"
          >
            Select Date:
          </Text>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            width={{ base: '100%', md: 'auto' }}
            textTransform="uppercase"
            fontSize="sm"
            max={getCurrentDateForInput()}
          />
          <Button
            colorScheme="gray"
            size="sm"
            variant="outline"
            onClick={handleFetchData}
            width={{ base: '100%', md: 'auto' }}
            mt={{ base: 2, md: 0 }}
            leftIcon={<SearchIcon />} // Add search icon on the left
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
                  <Th borderColor={borderColor}>Status on</Th>
                  <Th borderColor={borderColor}>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((item, index) => (
                  <Tr key={item.id}>
                    <Td borderColor={borderColor}>{index + 1}</Td>
                    <Td borderColor={borderColor}>{item.Title}</Td>
                    <Td borderColor={borderColor}>{item.Dated}</Td>
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
          <Box fontStyle="regular" fontSize="sm" color={'blue.500'}>
            No data available. Please fetch the report.
          </Box>
        )}
      </Box>
    </VStack>
  );
};

export default DailyGenerationReport;

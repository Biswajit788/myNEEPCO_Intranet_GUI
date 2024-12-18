import React from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';

interface LastUpdatedProps {
  lastUpdated?: string | null;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ lastUpdated }) => {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'dark' ? 'gray.300' : 'gray.700';

  // Format date to dd/mm/yyyy
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box textAlign="right" fontSize="sm" fontStyle="italic" mb={6}>
      {lastUpdated && (
        <Text color={textColor}>
          <b>Page Last Updated On:</b> &nbsp;{formatDate(lastUpdated)}
        </Text>
      )}
    </Box>
  );
};

export default LastUpdated;

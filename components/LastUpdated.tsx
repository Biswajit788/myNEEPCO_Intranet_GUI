import React from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';

interface LastUpdatedProps {
  lastUpdated?: string | null;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ lastUpdated }) => {
  const { colorMode } = useColorMode();
  const textColor = colorMode === 'dark' ? 'gray.300' : 'gray.700';

  return (
    <Box textAlign="right" fontSize="sm" fontStyle="italic" mb={6}>
      {lastUpdated && (
        <Text color={textColor}>
          <b>Page Last Updated On:</b> &nbsp;{new Date(lastUpdated).toLocaleDateString()}
        </Text>
      )}
    </Box>
  );
};

export default LastUpdated;

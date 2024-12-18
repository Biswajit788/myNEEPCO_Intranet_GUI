import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.700" color="white" py={4} textAlign="center">
      <Text fontSize="sm">
        © {new Date().getFullYear()} IT Department, Shillong, NEEPCO LTD. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;

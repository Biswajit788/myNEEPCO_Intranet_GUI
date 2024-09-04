import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Image from 'next/image';

export default function NoDataDisplay() {
    return (
        <Box>
            <Image
                src="/NoContent.png"
                alt="No data"
                width={100}
                height={100}
            />
            <Text fontSize="sm" mt={4} fontStyle={'italic'} fontWeight={'lighter'}>
                No data to display
            </Text>
        </Box>
    );
}

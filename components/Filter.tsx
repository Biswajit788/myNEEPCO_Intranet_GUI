"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { Flex, Input, InputGroup, InputLeftAddon, Text } from '@chakra-ui/react';

interface FilterProps {
    onFilter: (orderNo: string, orderDt: string) => void;
    onReset: () => void;
}

const Filter: React.FC<FilterProps> = ({ onFilter, onReset }) => {
    const [orderNo, setOrderNo] = useState('');
    const [orderDt, setOrderDt] = useState('');

    useEffect(() => {
        // Trigger the reset function once on initial mount to render data
        onReset();
    }, [onReset]);

    useEffect(() => {
        if (orderNo || orderDt) {
            onFilter(orderNo, orderDt);
        } else {
            onReset();
        }
    }, [orderNo, orderDt, onFilter, onReset]);

    return (
        <Flex
            direction={{ base: 'column', md: 'row' }} // Column for small/medium screens, row for larger screens
            width={{ base: '100%', md: '100%', lg: '50%' }} // Adjust width based on screen size
            alignItems="center"
            justifyContent="space-between"
            gap={{ base: 4, md: 2 }} // Adjust gap based on screen size
            mb={6}
        >
            <InputGroup width="100%" mb={{ base: 2, md: 2 }} size="sm">
                <InputLeftAddon>Order Num:</InputLeftAddon>
                <Input
                    value={orderNo}
                    onChange={(e) => setOrderNo(e.target.value)}
                    width="100%" // Full width for input field
                    size="sm"
                />
            </InputGroup>
            <Text p={2}>/</Text>
            <Input
                type="date"
                variant="filled"
                value={orderDt}
                textTransform="uppercase"
                onChange={(e) => setOrderDt(e.target.value)}
                width="100%"
                mb={{ base: 2, md: 2 }}
                size="sm"
            />
        </Flex>
    );
};

export default Filter;

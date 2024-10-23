"use client";
import React, { useState, useCallback } from 'react';
import {
    Flex,
    Input,
    Text,
    IconButton,
    Box,
    InputGroup,
    InputLeftAddon,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    PopoverHeader,
    Button,
    InputLeftElement,
    Icon,
    useColorMode,
    Tooltip,
} from '@chakra-ui/react';
import { FiSearch, FiFilter, FiGrid, FiList, FiArrowDown, FiArrowUp } from 'react-icons/fi';

interface FilterProps {
    onSearch: (searchText: string) => void;
    onFilter: (orderNo: string, orderDt: string) => void;
    onSortByDate: (sortOrder: 'asc' | 'desc') => void;
}

const Filter: React.FC<FilterProps> = ({ onSearch, onFilter, onSortByDate }) => {
    const { colorMode } = useColorMode();
    const [searchText, setSearchText] = useState('');
    const [orderNo, setOrderNo] = useState('');
    const [orderDt, setOrderDt] = useState('');

    const [openPopover, setOpenPopover] = useState<'filter' | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setSearchText(value);
            onSearch(value);
        },
        [onSearch]
    );

    const handleFilterApply = () => {
        onFilter(orderNo, orderDt);
        setOpenPopover(null);
    };

    const handleReset = () => {
        setOrderNo('');
        setOrderDt('');
        onFilter('', '');
    };

    const handlePopoverOpen = () => {
        setOpenPopover('filter');
    };

    const handlePopoverClose = () => {
        setOpenPopover(null);
    };

    const handleSortToggle = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        onSortByDate(newSortOrder);
    };

    return (
        <Flex
            direction={{ base: 'column', md: 'row' }}
            alignItems="center" // Align items to the left on small screens
            justifyContent={{ base: 'flex-start', md: 'space-between' }} // Left alignment on small screens
            wrap="wrap"
            gap={{ base: 4, md: 2 }}
            mb={10}
            p={1}
            border="1px solid"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
            bgColor={colorMode === 'light' ? 'gray.50' : 'gray.700'}
        >
            {/* Search Field */}
            <Flex flex="1" align="center" mb={{ base: 4, md: 0 }} width={{ base: '100%', md: 'auto' }}>
                <InputGroup width="100%"> {/* Make input take full width on small screens */}
                    <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color={colorMode === 'light' ? 'gray.500' : 'gray.300'} />
                    </InputLeftElement>
                    <Input
                        placeholder="Search"
                        value={searchText}
                        width="100%" // Full width on small screens
                        onChange={handleSearch}
                        border="none"
                        _focus={{ boxShadow: 'none' }}
                    />
                </InputGroup>
                {/** Hidden divider on small screen */}
                <Box
                    display={{ base: 'none', md: 'block' }}
                    width="1px"
                    height="24px"
                    backgroundColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                    mx={2}
                />
            </Flex>

            {/* Buttons Section */}
            <Flex
                alignItems="center"
                gap={2}
                wrap="wrap"
                justify={{ base: 'flex-start', md: 'flex-end' }}
                width={{ base: '100%', md: 'auto' }} // Full width buttons on mobile
            >
                {/* Sort by Date Button */}
                <Tooltip label={`Sort by ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`} aria-label="Sort Tooltip">
                    <Button
                        onClick={handleSortToggle}
                        size="sm"
                        leftIcon={sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                        variant={sortOrder === 'asc' ? 'solid' : 'outline'}
                        fontWeight="normal"
                        width={{ base: '100%', md: 'auto' }} // Full width on small screens
                    >
                        Sort by Date
                    </Button>
                </Tooltip>

                {/* Filter Button */}
                <Popover isOpen={openPopover === 'filter'} onClose={handlePopoverClose} placement="bottom-end">
                    <PopoverTrigger>
                        <Button
                            aria-label="Filter"
                            leftIcon={<FiFilter />}
                            size="sm"
                            onClick={handlePopoverOpen}
                            variant={openPopover === 'filter' ? 'solid' : 'outline'}
                            fontWeight="normal"
                            width={{ base: '100%', md: 'auto' }} // Full width on small screens
                        >
                            Filter
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
                        color={colorMode === 'light' ? 'black' : 'white'}
                        mt={1}
                    >
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Filter by:</PopoverHeader>
                        <PopoverBody>
                            <InputGroup size="sm" mb={3}>
                                <InputLeftAddon>Order Num:</InputLeftAddon>
                                <Input
                                    value={orderNo}
                                    onChange={(e) => setOrderNo(e.target.value)}
                                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                                    color={colorMode === 'light' ? 'black' : 'white'}
                                />
                            </InputGroup>
                            <Text align="center" mb={3}>
                                -------------------------
                            </Text>
                            <InputGroup size="sm">
                                <InputLeftAddon>Order Date:</InputLeftAddon>
                                <Input
                                    type="date"
                                    value={orderDt}
                                    onChange={(e) => setOrderDt(e.target.value)}
                                    bg={colorMode === 'light' ? 'white' : 'gray.700'}
                                    color={colorMode === 'light' ? 'black' : 'white'}
                                    textTransform="uppercase"
                                />
                            </InputGroup>
                            <Button mt={3} size="xs" colorScheme="blue" onClick={handleFilterApply}>
                                Apply
                            </Button>
                            <Button mt={3} ml={2} size="xs" colorScheme="orange" onClick={handleReset}>
                                Reset
                            </Button>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>

                <Box
                    display={{ base: 'none', md: 'block' }}
                    width="1px"
                    height="24px"
                    backgroundColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                    mx={2}
                />

                {/* View Mode Icons */}
                <Tooltip label="Grid View" aria-label="Grid View Tooltip">
                    <IconButton
                        aria-label="Grid View"
                        icon={<FiGrid />}
                        size="sm"
                        variant={viewMode === 'grid' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('grid')}
                        width={{ base: '100%', md: 'auto' }} // Full width on small screens
                    />
                </Tooltip>
                <Tooltip label="List View" aria-label="List View Tooltip">
                    <IconButton
                        aria-label="List View"
                        icon={<FiList />}
                        size="sm"
                        variant={viewMode === 'list' ? 'solid' : 'outline'}
                        onClick={() => setViewMode('list')}
                        width={{ base: '100%', md: 'auto' }} // Full width on small screens
                    />
                </Tooltip>
            </Flex>
        </Flex>
    );
};

export default Filter;

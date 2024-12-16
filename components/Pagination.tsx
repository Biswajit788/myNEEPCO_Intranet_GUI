import React from 'react';
import { Button, HStack, Text, IconButton, useColorModeValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
  // Define colors for dark and light mode
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const buttonBorderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <HStack spacing={4} justify="space-between" mt={8}>
      {/* Left side showing total number of records */}
      <Text fontSize="sm" color={textColor} fontStyle="italic" fontWeight="bold">
        Total Records: <span style={{fontSize: '16px'}}>{totalRecords}</span>
      </Text>

      {/* Pagination controls */}
      <HStack spacing={2} alignItems="center">
        {/* First Page Button */}
        <IconButton
          icon={<ArrowLeftIcon />}
          onClick={() => onPageChange(1)}
          isDisabled={currentPage === 1}
          aria-label="First Page"
          size="sm"
          variant="outline"
          borderColor={buttonBorderColor}
        />

        {/* Previous Page Button */}
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          leftIcon={<ChevronLeftIcon />}
          variant="outline"
          borderColor={buttonBorderColor}
        />

        {/* Current Page / Total Pages */}
        <Text fontSize="sm" color={textColor}>
          Page {currentPage} / {totalPages}
        </Text>

        {/* Next Page Button */}
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          rightIcon={<ChevronRightIcon />}
          variant="outline"
          borderColor={buttonBorderColor}
        />

        {/* Last Page Button */}
        <IconButton
          icon={<ArrowRightIcon />}
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          aria-label="Last Page"
          size="sm"
          variant="outline"
          borderColor={buttonBorderColor}
        />
      </HStack>
    </HStack>
  );
};

export default Pagination;

import React from 'react';
import { Button, HStack, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
  return (
    <HStack spacing={4} justify="space-between" mt={8}>
      {/* Left side showing total number of records */}
      <Text fontSize="sm" color="gray.700" fontStyle={'italic'} fontWeight={'bold'}>
        Total Records: {totalRecords}
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
        />

        {/* Previous Page Button */}
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          leftIcon={<ChevronLeftIcon/>}
          variant="outline"
        />

        {/* Current Page / Total Pages */}
        <Text fontSize="sm">
          Page {currentPage} / {totalPages}
        </Text>

        {/* Next Page Button */}
        <Button
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          rightIcon={<ChevronRightIcon />}
          variant="outline"
        />

        {/* Last Page Button */}
        <IconButton
          icon={<ArrowRightIcon />}
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          aria-label="Last Page"
          size="sm"
          variant="outline"
        />
      </HStack>
    </HStack>
  );
};

export default Pagination;

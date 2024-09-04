import React from 'react';
import { Button, HStack, Text, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pagesToShow = [];

  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pagesToShow.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage > totalPages - 3) {
      pagesToShow.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pagesToShow.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
  }

  return (
    <HStack spacing={2} justify="center" mt={8}>
      <IconButton
        icon={<ArrowLeftIcon />}
        onClick={() => onPageChange(1)}
        isDisabled={currentPage === 1}
        aria-label="First Page"
        size="sm"
        variant="outline"
      />

      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        leftIcon={<ChevronLeftIcon />}
        variant="outline"
      >
        Previous
      </Button>

      {pagesToShow.map((page, index) =>
        typeof page === 'number' ? (
          <Button
            key={index}
            size="sm"
            onClick={() => onPageChange(page)}
            colorScheme={page === currentPage ? 'blue' : undefined}
            variant={page === currentPage ? 'solid' : 'outline'}
          >
            {page}
          </Button>
        ) : (
          <Text key={index} as="span" px={2}>
            {page}
          </Text>
        )
      )}

      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        rightIcon={<ChevronRightIcon />}
        variant="outline"
      >
        Next
      </Button>

      <IconButton
        icon={<ArrowRightIcon />}
        onClick={() => onPageChange(totalPages)}
        isDisabled={currentPage === totalPages}
        aria-label="Last Page"
        size="sm"
        variant="outline"
      />
    </HStack>
  );
};

export default Pagination;

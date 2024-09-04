'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { SkewLoader } from 'react-spinners';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  // Use the useAuth hook to check for token expiry
  useAuth(); 

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); // Set timeout to 1 second or adjust as needed

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <SkewLoader color="#090979" size={30} />
        </Box>
      ) : (
        <Sidebar>
          <Box pt="5rem">
            {children}
          </Box>
        </Sidebar>
      )}
    </>
  );
};

export default DashboardLayout;

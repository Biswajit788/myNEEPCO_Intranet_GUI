'use client';

import { useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Stack,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Image,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import MenuComponent from './MenuComponent';

export default function Navbar() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Box bg={useColorModeValue('blue.200', 'gray.900')} px={4}>
        <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
          {/* Logo on the left on larger screens */}
          <Box display={{ base: 'none', md: 'flex' }}>
            <Button
              as={Link}
              href="/"
              variant={"link"}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <Image
                borderRadius='full'
                boxSize='50px'
                src='/logo170.gif'
                alt='NEEPCO LTD'
                m={{ base: 2 }}
              />
            </Button>
          </Box>

          {/* Use MenuComponent for navigation */}
          <MenuComponent />

          {/* Color mode toggle and profile menu on the right */}
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={2}>
              <Button
                onClick={toggleColorMode}
                bg="inherit"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={'avatar.png'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <MenuItem
                    as={Link}
                    href="/signin"
                    _hover={{ color: 'blue.500', bg: 'transparent' }}
                  >
                    Login
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

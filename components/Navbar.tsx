'use client'

import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
  Link as ChakraLink,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import { IoHomeOutline } from "react-icons/io5";
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  children: React.ReactNode,
  href: string,
}

const NavLink = (props: Props) => {
  const { children, href } = props

  return (
    <ChakraLink
      as={Link}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
        color: useColorModeValue('black', 'white'),
      }}
      href={href}>
      {children}
    </ChakraLink>
  )
}

export default function Navbar() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box
        bg={useColorModeValue('blue.100', 'gray.900')}
        px={4}
      >
        <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
          {/* Hamburger Icon on the left */}
          <IconButton
            size={'md'}
            icon={<HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={onOpen}
          />

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

          {/* NavLinks centered on larger screens */}
          <Flex
            flex={1}
            justify={{ base: 'center', md: 'center' }} // Center alignment for both screen sizes
          >
            <Stack
              direction={'row'}
              spacing={7}
              display={{ base: 'none', md: 'flex' }} // Hide on smaller screens
              bg={'gray.700'}
              color={'white'}
              p={2}
              borderRadius="full"
            >
              <NavLink href="/">
                <Flex align="center">
                  <IoHomeOutline size={20} /> {/* Adjust size as needed */}
                  <Text ml={2}>Home</Text> {/* Adjust margin as needed */}
                </Flex>
              </NavLink>
              <NavLink href="/signin">HR</NavLink>
              <NavLink href="/signin">ISO</NavLink>
              <NavLink href="/signin">Downloads</NavLink>
            </Stack>
          </Flex>

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
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'avatar.png'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                    <MenuItem
                      as={Link}
                      href="/signin"
                      onMouseEnter={() => router.prefetch('/signin')}
                      _hover={{color: 'blue.500', bg: 'transparent'}}
                    >
                      Login
                    </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>

      {/* Drawer for mobile menu */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>NEEPCO INTRANET</DrawerHeader>

          <DrawerBody>
            <Stack>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/dashboard/hr">HR</NavLink>
              <NavLink href="/iso">ISO</NavLink>
              <NavLink href="/downloads">Downloads</NavLink>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

'use client'

import React, { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Collapse,
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorMode,
  useColorModeValue,
  Text,
  Divider,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  useBreakpointValue,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import {
  FiTrendingUp,
  FiMenu,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi'
import {
  AiOutlineDashboard, AiOutlineDownload, AiOutlineFileDone,
  AiOutlineSchedule, AiOutlineAreaChart, AiOutlineContainer
} from "react-icons/ai";
import { IconType } from 'react-icons'
import { useRouter, usePathname } from 'next/navigation'
import { useRef } from 'react'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  username: string;
  email: string;
}

interface LinkItemProps {
  name: string
  icon: IconType
  href: string
}

interface SubItemProps {
  name: string
  href: string
  icon: IconType // Added icon for sub-items
}

interface NavItemProps extends FlexProps {
  icon: IconType
  href: string
  children: ReactNode
  subItems?: SubItemProps[] // Updated to use SubItemProps
  isActive?: boolean // Added for active state
  onLinkClick?: () => void // Added for handling link clicks
  pathname: string // Added for current pathname
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'My Dashboard', icon: AiOutlineDashboard, href: '/dashboard' },
  { name: 'HR', icon: FiTrendingUp, href: '#' },
  { name: 'Reports', icon: AiOutlineFileDone, href: '#' },
  { name: 'Rules', icon: AiOutlineSchedule, href: '#' },
  { name: 'ISO', icon: AiOutlineAreaChart, href: '#' },
  { name: 'Downloads', icon: AiOutlineDownload, href: '#' },
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const bgColor = useColorModeValue('white', 'gray.900');
  const btnColor = useColorModeValue('white', 'white');
  const titlebgColor = useColorModeValue('gray.900', 'gray.900');
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // Conditional top padding based on screen size
  const topPadding = useBreakpointValue({ base: '0', md: '5rem' });

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('gray.100', 'gray.900')}
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      pt={topPadding}
      {...rest}
    >
      {isSmallScreen && (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg={titlebgColor}
          py={3}
          px={4}
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Text
            fontSize="md"
            fontWeight="bold"
            display={{ base: 'block', md: 'none' }}
            color={'white'}
          >
            NEEPCO INTRANET
          </Text>
          <CloseButton
            display={{ base: 'block', md: 'none' }}
            onClick={onClose}
            color={btnColor}
          />
        </Flex>
      )}
      <Divider />
      <Box
        mt={4}
        py={0}
        px={0}
        overflowY="auto"
        height="100vh"
        maxHeight="calc(100vh - 140px)"
        flexDirection="column"
        css={{
          '&::-webkit-scrollbar': {
            width: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: useColorModeValue('#f1f1f1', '#1a202c'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: useColorModeValue('#888', '#555'),
            borderRadius: '10px',
            border: '4px solid transparent',
            backgroundClip: 'padding-box',
          },
          '&::-webkit-scrollbar-button': {
            backgroundColor: useColorModeValue('#ddd', '#444'),
            height: '16px',
            width: '16px',
            borderRadius: '4px',
          },
        }}
      >
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            isActive={pathname === link.href}
            pathname={pathname}
            subItems={
              link.name === 'HR'
                ? [
                  { name: 'Accolades', href: '/dashboard/hr/accolades', icon: AiOutlineContainer },
                  { name: 'Annual Increment', href: '/dashboard/hr/increment', icon: AiOutlineContainer },
                  { name: 'Pay Scale Benefit', href: '/dashboard/hr/scale-benefit', icon: AiOutlineContainer },
                  { name: 'Promotion', href: '/dashboard/hr/promotion', icon: AiOutlineContainer },
                  { name: 'Seniority List', href: '/dashboard/hr/seniority', icon: AiOutlineContainer },
                  { name: 'Training', href: '/dashboard/hr/training', icon: AiOutlineContainer },
                  { name: 'Transfer & Posting', href: '/dashboard/hr/transfer', icon: AiOutlineContainer },
                  { name: 'Vigilance Clearance', href: '/dashboard/hr/vigilance', icon: AiOutlineContainer },
                ]
                : link.name === 'Reports'
                  ? [
                    { name: 'Daily Report', href: '/dashboard/report/daily', icon: AiOutlineContainer },
                    { name: 'Weekly Report', href: '/dashboard/report/weekly', icon: AiOutlineContainer },
                    { name: 'Monthly Report', href: '/dashboard/report/monthly', icon: AiOutlineContainer },
                    { name: 'Quarterly Report', href: '/dashboard/report/quarterly', icon: AiOutlineContainer },
                    { name: 'Annual Report', href: '/dashboard/report/annual', icon: AiOutlineContainer },
                  ]
                  : link.name === 'Rules'
                    ? [
                      { name: 'DOP Rules', href: '', icon: AiOutlineContainer },
                      { name: 'Disposal Manual', href: '', icon: AiOutlineContainer },
                      { name: 'Contracts & Procurement Manual', href: '', icon: AiOutlineContainer },
                    ]
                    : link.name === 'Downloads'
                      ? [
                        { name: 'Forms & Application', href: '/dashboard/download/forms', icon: AiOutlineContainer },
                        { name: 'General', href: '', icon: AiOutlineContainer },
                        { name: 'Photo Gallery', href: '/dashboard/download/photo', icon: AiOutlineContainer },
                      ]
                      : undefined
            }
            onLinkClick={onClose}
          >
            {link.name}
          </NavItem>
        ))}
      </Box>
    </Box>
  );
};

const NavItem = ({
  icon,
  href,
  children,
  subItems,
  isActive,
  onLinkClick,
  pathname,
}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (subItems) {
      setIsOpen(!isOpen);
    } else if (onLinkClick) {
      onLinkClick(); // Close the drawer when a link is clicked
    }
  };

  const bgColor = useColorModeValue('blue.100', 'gray.600');
  const hoverBgColor = useColorModeValue('gray.300', 'gray.500');
  const activeColor = useColorModeValue('blue.900', 'white');
  const notActiveColor = useColorModeValue('black', 'white');

  return (
    <Box>
      <Link href={href} passHref>
        <Flex
          align="center"
          p="4"
          mx="2"
          role="group"
          cursor="pointer"
          onClick={handleClick}
          color={isActive ? activeColor : notActiveColor}
          bg={isActive ? bgColor : 'transparent'}
          overflow="hidden"
          position="relative"
          borderRight={isActive ? '4px solid' : 'none'} // Bolder right border when active
          borderColor={isActive ? activeColor : 'transparent'}
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bg: hoverBgColor,
            transform: 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.3s ease',
            zIndex: -1,
          }}
          _hover={{
            _before: {
              transform: 'scaleY(0.9)', // Adjust this value to increase/decrease the height of the hover background
            },
            color: activeColor,
          }}
        >
          {icon && (
            <Icon
              mr="4"
              fontSize="16" // Set font size smaller
              _groupHover={{
                color: activeColor,
              }}
              as={icon}
            />
          )}
          <Box flex="1" fontSize="md"> {/* Smaller font size */}
            {children}
          </Box>
          {subItems && (
            <Icon
              as={isOpen ? FiChevronDown : FiChevronRight}
              ml="auto"
              transition="transform 0.2s"
            />
          )}
        </Flex>
      </Link>
      <Collapse in={isOpen} animateOpacity>
        {subItems && (
          <Box pl="8" mt="2" display="flex" flexDirection="column">
            {subItems.map((item) => {
              const isSubItemActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} passHref>
                  <Flex
                    align="center"
                    p="2"
                    bg={isSubItemActive ? bgColor : 'transparent'}
                    borderRight={isSubItemActive ? '4px solid' : 'none'} // Bolder right border when sub-item is active
                    borderColor={isSubItemActive ? activeColor : 'transparent'}
                    _hover={{
                      transform: 'scale(1.05)',
                      bg: hoverBgColor,
                    }}
                    onClick={onLinkClick} // Close the drawer when a sub-item is clicked
                    color={isSubItemActive ? activeColor : 'inherit'}
                    fontSize="sm" // Set font size smaller for sub-items
                  >
                    {item.icon && (
                      <Icon
                        mr="3"
                        fontSize="12" // Set font size smaller for sub-item icons
                        as={item.icon}
                      />
                    )}
                    <Text>{item.name}</Text>
                  </Flex>
                </Link>
              );
            })}
          </Box>
        )}
      </Collapse>
    </Box>

  );
};

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [username, setUsername] = useState<string>(''); // State for username
  const [email, setEmail] = useState<string>(''); // State for Email
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
        setEmail(decodedToken.email);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleSignOut = () => {
    setIsSignOutOpen(true); // Open the AlertDialog when Sign Out is clicked
  };

  const confirmSignOut = async () => {
    setIsLoading(true);
    setIsSignOutOpen(false);

    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSignOut = () => {
    setIsSignOutOpen(false); // Close the AlertDialog
  };

  const menuItemHoverStyle = {
    color: 'blue.500',
    bg: 'transparent'
  }

  return (
    <>
      <Flex
        position="fixed"
        top="0"
        zIndex="1000"
        width="100%"
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue(
          'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)',
          'gray.900'
        )}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('blue.200', 'gray.700')}
        justifyContent={{ base: 'center', md: 'space-between' }}
        {...rest}
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          color={'white'}
          icon={<FiMenu />}
        />
        <Flex
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          justifyContent="flex-start"
          flex="1"
        >
          <Image
            display={{ base: 'none', md: 'flex' }}
            borderRadius="full"
            boxSize="50px"
            src="/logo170.gif"
            alt="NEEPCO LTD"
          />
          <Text
            ml="4"
            fontSize="lg"
            color={useColorModeValue('white', 'white')}
          >
            NEEPCO INTRANET
          </Text>
        </Flex>
        <Box
          display={{ base: 'flex', md: 'none' }}
          justifyContent="center"
          width="100%"
        >
          <Image
            borderRadius="full"
            boxSize="50px"
            src="/logo170.gif"
            alt="NEEPCO LTD"
          />
        </Box>
        <HStack spacing={{ base: '0', md: '6' }}>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="toggle dark mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
          <Flex alignItems="center">
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar size="sm" src="/avatar.png" />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{username || 'Loading...'}</Text>
                    <Text fontSize="xs" color="gray.600">
                      {email || 'Loading...'}
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <Link href="#" passHref>
                  <MenuItem bg={useColorModeValue('white', 'gray.900')} _hover={menuItemHoverStyle}>My Profile</MenuItem>
                </Link>
                <Link href="#" passHref>
                  <MenuItem bg={useColorModeValue('white', 'gray.900')} _hover={menuItemHoverStyle}>Change Password</MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem bg={useColorModeValue('white', 'gray.900')} _hover={menuItemHoverStyle} onClick={handleSignOut}>
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>

      {/* AlertDialog for Sign Out Confirmation */}
      <AlertDialog
        isOpen={isSignOutOpen}
        leastDestructiveRef={cancelRef}
        onClose={cancelSignOut}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Sign Out
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to sign out?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={cancelSignOut}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmSignOut} ml={3}>
                Sign Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Spinner Overlay */}
      {isLoading && (
        <Center
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor="rgba(0, 0, 0, 0.5)" // Semi-transparent background
          zIndex="2000"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Center>
      )}
    </>
  );
};

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleLinkClick = () => {
    onClose()
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('white', 'gray.900')}>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={handleLinkClick} />
        </DrawerContent>
      </Drawer>
      <SidebarContent onClose={handleLinkClick} display={{ base: 'none', md: 'block' }} />
      <Box ml={{ base: 0, md: 60 }} p="2">
        {children}
      </Box>

    </Box>
  )
}

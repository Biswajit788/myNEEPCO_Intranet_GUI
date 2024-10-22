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
  AiOutlineDashboard, AiOutlineDownload, AiOutlineFileSearch ,
  AiOutlineSchedule, AiOutlineAreaChart, AiOutlineContainer,
} from "react-icons/ai";
import { IconType } from 'react-icons'
import { FaComputer } from "react-icons/fa6";
import { useRouter, usePathname } from 'next/navigation'
import { useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import ChangePasswordModal from './ChangePasswordModal'

interface DecodedToken {
  fname: string;
  lname: string,
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
  { name: 'IT', icon: FaComputer, href: '#' },
  { name: 'Power Gen Report', icon: AiOutlineFileSearch, href: '#' },
  { name: 'Rules', icon: AiOutlineSchedule, href: '#' },
  { name: 'ISO', icon: AiOutlineAreaChart, href: '/dashboard/iso' },
  { name: 'Downloads', icon: AiOutlineDownload, href: '#' },
]

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const pathname = usePathname();
  const bgColor = useColorModeValue('white', 'gray.900');
  const btnColor = useColorModeValue('white', 'white');
  const titleBgColor = useColorModeValue('gray.900', 'gray.900');
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  // Conditional top padding based on screen size
  const topPadding = useBreakpointValue({ base: '0', md: '5rem' });

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('gray.100', 'gray.900')}
      borderRightWidth="2px"
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
          bg={titleBgColor}
          py={3}
          px={4}
          position="sticky"
          top="0"
          zIndex="10"
        >
          <Text
            fontSize="md"
            fontWeight="bold"
            color={'white'}
          >
            NEEPCO INTRANET
          </Text>
          <CloseButton
            onClick={onClose}
            color={btnColor}
          />
        </Flex>
      )}
      <Divider />
      <Box
        mt={2}
        py={0}
        px={0}
        className="custom-scrollbar"
        overflowY="auto"
        height="100vh"
        maxHeight="calc(100vh - 100px)"
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
                : link.name === 'Power Gen Report'
                  ? [
                    { name: 'Daily Report', href: '/dashboard/report/daily', icon: AiOutlineContainer },
                    { name: 'Monthly Report', href: '/dashboard/report/monthly', icon: AiOutlineContainer },
                    { name: 'Quarterly Report', href: '/dashboard/report/quarterly', icon: AiOutlineContainer },
                    { name: 'Annual Report', href: '/dashboard/report/annual', icon: AiOutlineContainer },
                  ]
                  : link.name === 'Rules'
                    ? [
                      { name: 'DOP Rules', href: '/dashboard/rules/dop', icon: AiOutlineContainer },
                      { name: 'Disposal Manual', href: '/dashboard/rules/disposal', icon: AiOutlineContainer },
                      { name: 'Contracts & Procurement Manual', href: '/dashboard/rules/contracts', icon: AiOutlineContainer },
                    ]
                    : link.name === 'IT'
                      ? [
                        { name: 'ERP', href: '/dashboard/it/erp', icon: AiOutlineContainer },
                        { name: 'Policy', href: '/dashboard/it/policy', icon: AiOutlineContainer },
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
          role="group"
          cursor="pointer"
          onClick={handleClick}
          color={isActive ? activeColor : notActiveColor}
          bg={isActive ? bgColor : 'transparent'}
          borderRight={isActive ? '4px solid' : 'none'}
          borderColor={isActive ? activeColor : 'transparent'}
          _hover={{
            bg: hoverBgColor,
            color: activeColor,
          }}
        >
          {icon && (
            <Icon
              mr="2"
              fontSize="18"
              as={icon}
            />
          )}
          <Box flex="1" fontSize="sm" fontWeight="normal">
            {children}
          </Box>
          {subItems && (
            <Icon
              as={isOpen ? FiChevronDown : FiChevronRight}
              ml="auto"
              transition="transform 0.3s"
            />
          )}
        </Flex>
      </Link>
      <Collapse in={isOpen} animateOpacity>
        {subItems && (
          <Box pl="6" mt="2" display="flex" flexDirection="column">
            {subItems.map((item) => {
              const isSubItemActive = pathname === item.href; // Determine if the sub-item is active
              return (
                <Link key={item.name} href={item.href} passHref>
                  <Flex
                    align="center"
                    p="2"
                    mb="2"
                    borderRight={isSubItemActive ? '4px solid' : 'none'}
                    borderColor={isSubItemActive ? activeColor : 'transparent'}
                    _hover={{
                      bg: hoverBgColor, // Change background color on hover
                    }}
                    onClick={onLinkClick} // Close the drawer when a sub-item is clicked
                    color={isSubItemActive ? activeColor : 'inherit'}
                    fontSize="sm" // Set font size smaller for sub-items
                    bg={isSubItemActive ? bgColor : 'transparent'} // Set background color for active sub-items
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
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>(''); // State for Email
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token);
        setFirstname(decodedToken.fname);
        setLastname(decodedToken.lname);
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

  const openChangePasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closeChangePasswordModal = () => {
    setIsPasswordModalOpen(false);
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
                    <Text fontSize="sm">{firstname}&nbsp;{lastname}</Text>
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
                  <MenuItem bg={useColorModeValue('white', 'gray.900')} _hover={menuItemHoverStyle} onClick={openChangePasswordModal}>Change Password</MenuItem>
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

      {/* Change Password Modal */}
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={closeChangePasswordModal} />

      {/* AlertDialog for Sign Out Confirmation */}
      <AlertDialog
        isOpen={isSignOutOpen}
        leastDestructiveRef={cancelRef}
        onClose={cancelSignOut}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            maxWidth={{ base: '70%', md: '400px' }}
          >
            <AlertDialogHeader
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="bold"
            >
              Sign Out
            </AlertDialogHeader>

            <AlertDialogBody fontSize={{ base: 'sm', md: 'md' }}>
              Are you sure you want to sign out?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={cancelSignOut}
                size={{ base: 'sm', md: 'md' }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmSignOut}
                ml={3}
                size={{ base: 'sm', md: 'md' }}
              >
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

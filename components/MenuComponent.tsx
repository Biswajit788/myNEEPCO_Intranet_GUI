'use client';

import { useState } from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    Collapse,
    Stack,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Link,
} from '@chakra-ui/react';
import { IoChevronDown, IoChevronForward, IoHomeOutline } from 'react-icons/io5';
import { FaGlobe } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';

// Define the NavLink props interface
interface NavLinkProps {
    children: React.ReactNode;
    href: string;
}

// Define the NavLink component
const NavLink: React.FC<NavLinkProps> = ({ children, href }) => (
    <Link
        href={href}
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
            textDecoration: 'none',
            bg: 'gray.200',
            color: 'blue.500',
        }}
    >
        {children}
    </Link>
);

const MenuComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isPortalOpen, setPortalOpen] = useState(false);

    const onTogglePortal = () => setPortalOpen(!isPortalOpen);

    return (
        <>
            <Box bg="transparent" px={4}>
                <Flex h={20} alignItems={'center'} justifyContent={'space-between'}>
                    {/* Hamburger icon for smaller screens */}
                    <IconButton
                        size={'md'}
                        icon={<HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }} // Show only on smaller screens
                        onClick={onOpen}
                    />

                    {/* Navigation Links for larger screens */}
                    <Flex flex={1} justify={{ base: 'center', md: 'center' }}>
                        <Stack direction={'row'} spacing={7} display={{ base: 'none', md: 'flex' }} bg={'gray.700'} color={'white'} p={2} borderRadius="full">
                            <NavLink href="/">
                                <Flex align="center">
                                    <IoHomeOutline size={20} />
                                    <Text ml={2}>Home</Text>
                                </Flex>
                            </NavLink>

                            {/* Menu for Internal Portal with Icon Toggle */}
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    fontWeight="normal"
                                    variant={"link"}
                                    colorScheme="white"
                                    rightIcon={isPortalOpen ? <IoChevronDown /> : <IoChevronForward />}
                                    onClick={onTogglePortal}
                                    ml={2}
                                >
                                    Internal Portal
                                </MenuButton>
                                <MenuList bg="gray.700">
                                    <MenuItem as={Link} href="http://10.3.0.10:8080/neepcopf/" target="_blank" bg="transparent" _hover={{ color: 'blue.500', bg: 'gray.200' }}>
                                        PF Portal
                                    </MenuItem>
                                    <MenuItem as={Link} href="http://10.3.0.10:8080/PFEntry/" target="_blank" bg="transparent" _hover={{ color: 'blue.500', bg: 'gray.200' }}>
                                        PF Entry
                                    </MenuItem>
                                    <MenuItem as={Link} href="http://10.3.0.10:8080/MBF/" target="_blank" bg="transparent" _hover={{ color: 'blue.500', bg: 'gray.200' }}>
                                        MBF
                                    </MenuItem>
                                    <MenuItem as={Link} href="http://10.3.0.10:8080/OnlineComplain/" target="_blank" bg="transparent" _hover={{ color: 'blue.500', bg: 'gray.200' }}>
                                        NOCRP
                                    </MenuItem>
                                    <MenuItem as={Link} href="http://10.3.0.10:8080/OFFICEEMAILID/" target="_blank" bg="transparent" _hover={{ color: 'blue.500', bg: 'gray.200' }}>
                                        Official Email List
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <NavLink href="/downloads">Downloads</NavLink>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>

            {/* Drawer for mobile menu */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>NEEPCO INTRANET</DrawerHeader>
                    <DrawerBody>
                        <Stack spacing={4}>
                            <Flex justify="space-between" align="center">
                                <NavLink href="/">Home</NavLink>
                            </Flex>
                            {/* Internal Portal with Collapse for Mobile View */}
                            <Flex justify="space-between" align="center">
                                <NavLink href="/">Internal Portal</NavLink>
                                <Button
                                    variant={"link"}
                                    colorScheme="white"
                                    rightIcon={isPortalOpen ? <IoChevronDown /> : <IoChevronForward />}
                                    onClick={onTogglePortal}
                                    ml={2}
                                />
                            </Flex>

                            {/* Collapse component for mobile sub-items */}
                            <Collapse in={isPortalOpen}>
                                <Stack spacing={2} pl={8}> {/* Padding for indentation */}
                                    <Link href="http://10.3.0.10:8080/neepcopf/" target="_blank" rel="noopener noreferrer">
                                        <Flex align="center">
                                            <FaGlobe />
                                            <Text ml={2}>PF Portal</Text>
                                        </Flex>
                                    </Link>
                                    <Link href="http://10.3.0.10:8080/PFEntry/" target="_blank" rel="noopener noreferrer">
                                        <Flex align="center">
                                            <FaGlobe />
                                            <Text ml={2}>PF Entry</Text>
                                        </Flex>
                                    </Link>
                                    <Link href="http://10.3.0.10:8080/MBF/" target="_blank" rel="noopener noreferrer">
                                        <Flex align="center">
                                            <FaGlobe />
                                            <Text ml={2}>MBF</Text>
                                        </Flex>
                                    </Link>
                                    <Link href="http://10.3.0.10:8080/OnlineComplain/" target="_blank" rel="noopener noreferrer">
                                        <Flex align="center">
                                            <FaGlobe />
                                            <Text ml={2}>NOCRP</Text>
                                        </Flex>
                                    </Link>
                                    <Link href="http://10.3.0.10:8080/OFFICEEMAILID/" target="_blank" rel="noopener noreferrer">
                                        <Flex align="center">
                                            <FaGlobe />
                                            <Text ml={2}>Official Email List</Text>
                                        </Flex>
                                    </Link>
                                </Stack>
                            </Collapse>
                            <Flex justify="space-between" align="center">
                                <NavLink href="/downloads">Downloads</NavLink>
                            </Flex>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default MenuComponent;

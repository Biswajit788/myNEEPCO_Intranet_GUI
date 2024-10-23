import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    FormControl,
    FormLabel,
    useToast,
    Box,
    useBreakpointValue
} from '@chakra-ui/react';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [token, setToken] = useState<string | null>(null); // State to store the token
    const toast = useToast();

    // Use breakpoint value to adjust toast width based on screen size
    const toastWidth = useBreakpointValue({ base: '80%', md: 'md' });

    // Fetch the token from localStorage when the component mounts
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        setToken(savedToken);
    }, []);

    const handleSubmit = async () => {
        // Validate passwords
        if (password !== passwordConfirmation) {
            toast({
                title: 'Passwords do not match.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
                containerStyle: { maxWidth: toastWidth },
            });
            return;
        }

        // Check if token is available
        if (!token) {
            toast({
                title: 'Error',
                description: 'Authentication token not found.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top',
                containerStyle: { maxWidth: toastWidth },
            });
            return;
        }

        try {
            // Make API call to change the password
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/change-password`, // Your Strapi endpoint
                {
                    currentPassword,
                    password,
                    passwordConfirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the JWT token for authentication
                    },
                }
            );

            if (response.status === 200) {
                toast({
                    title: 'Success',
                    description: 'Password changed successfully.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'bottom',
                    containerStyle: { maxWidth: toastWidth },
                });

                // Clear the fields after successful change
                setCurrentPassword('');
                setPassword('');
                setPasswordConfirmation('');
                onClose();
            }
        } catch (error) {
            // Handle error response from API
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || 'Failed to change password.';
                toast({
                    title: 'Error',
                    description: errorMessage,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'bottom',
                    containerStyle: { maxWidth: toastWidth },
                });
            } else {
                // Handle unexpected errors
                toast({
                    title: "Network Error",
                    description: 'An unexpected error occurred. Please try again.',
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                    containerStyle: { maxWidth: toastWidth },
                });
            }
        }
    };

    const isSubmitDisabled = !currentPassword || !password || !passwordConfirmation;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', sm: 'sm', md: 'md' }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={{ base: 'md', sm: 'lg' }}>Change Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <FormControl isRequired>
                            <FormLabel fontSize={{ base: 'sm', sm: 'md' }}>Old Password</FormLabel>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                fontSize={{ base: 'md', sm: 'md' }}
                                p={{ base: 2, sm: 3 }}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel fontSize={{ base: 'sm', sm: 'md' }}>New Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fontSize={{ base: 'md', sm: 'md' }}
                                p={{ base: 2, sm: 3 }}
                            />
                        </FormControl>
                        <FormControl mt={4} isRequired>
                            <FormLabel fontSize={{ base: 'sm', sm: 'md' }}>Confirm New Password</FormLabel>
                            <Input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                fontSize={{ base: 'md', sm: 'md' }}
                                p={{ base: 2, sm: 3 }}
                            />
                        </FormControl>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isDisabled={isSubmitDisabled}
                        fontSize={{ base: 'sm', sm: 'md' }}
                        w={{ base: 'full', sm: 'auto' }}
                        whiteSpace="nowrap"  // Prevent text from wrapping
                    >
                        Change Password
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        ml={3}
                        fontSize={{ base: 'md', sm: 'md' }}
                        w={{ base: 'full', sm: 'auto' }}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangePasswordModal;

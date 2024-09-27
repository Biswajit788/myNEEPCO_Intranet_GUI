import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Divider,
  useToast,
  useBreakpointValue, // Import the hook
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios'; // Import axios

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Use breakpoint value to adjust toast width based on screen size
  const toastWidth = useBreakpointValue({ base: '80%', md: 'md' });

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`,
        { email }, // Request body
        { headers: { 'Content-Type': 'application/json' } } // Headers
      );

      if (response.status === 200) {
        toast({
          title: 'Success',
          description: 'Check your email for the password reset link.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
          containerStyle: { maxWidth: toastWidth },
        });
        setEmail(''); // Clear the email field
        onClose(); // Close modal on success
      }
    } catch (error) {
      // Check if the error is due to a response from the server
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific errors based on the status code
        handleErrors(error.response.status, error.response.data.message);
      } else {
        // Handle network or unexpected errors
        toast({
          title: "Network Error",
          description: 'An unexpected error occurred. Please try again.',
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth }, // Apply the dynamic maxWidth
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleErrors = (status: number, message: string) => {
    if (status === 400) {
      toast({
        title: "Forgot Password Error",
        description: 'Invalid email address or user does not exist.',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth }, // Apply the dynamic maxWidth
      });
    } else if (status === 401) {
      toast({
        title: "Forgot Password Error",
        description: 'Unauthorized access. Please try again later.',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth }, // Apply the dynamic maxWidth
      });
    } else if (status === 404) {
      toast({
        title: "Forgot Password Error",
        description: 'User not found. Please check the email address.',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth }, // Apply the dynamic maxWidth
      });
    } else if (status === 429) {
      toast({
        title: "Too Many Requests",
        description: 'You have made too many requests. Please wait a moment and try again.',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth }, // Apply the dynamic maxWidth
      });
    } else {
      toast({
        title: "An error occurred",
        description: message || 'An error occurred during the password reset process.',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth }, // Apply the dynamic maxWidth
      });
    }
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent
        maxWidth={{ base: '90%', md: '500px' }}
      >
        <ModalHeader fontSize={{ base: 'lg', md: 'xl' }}>Forgot Password</ModalHeader>
        <Divider />
        <ModalCloseButton size={{ base: 'sm', md: 'md' }} /> {/* Adjusting close button size for small screens */}

        <ModalBody mt={4}>
          <FormControl id="email">
            <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              size={{ base: 'md', md: 'md' }} // Smaller input size on small screens
              isRequired
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleForgotPassword}
            isLoading={loading}
            size={{ base: 'sm', md: 'md' }} // Smaller button size for small screens
          >
            Send Reset Link
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            size={{ base: 'sm', md: 'md' }} // Adjust button size based on screen
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

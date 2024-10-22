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
  useBreakpointValue,
} from '@chakra-ui/react';
import { useFormik } from 'formik';  // Import Formik
import * as Yup from 'yup';  // Import Yup for validation
import axios from 'axios';  // Import axios

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define Yup validation schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const toast = useToast();
  const toastWidth = useBreakpointValue({ base: '80%', md: 'md' });

  // Formik hook to manage form submission and validation
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`,
          { email: values.email }, // Use Formik's values for the request body
          { headers: { 'Content-Type': 'application/json' } }
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
          resetForm();  // Clear the form
          onClose();  // Close the modal on success
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          handleErrors(error.response.status, error.response.data.message);
        } else {
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
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleErrors = (status: number, message: string) => {
    const errorMessages: Record<number, string> = {
      400: 'Invalid email address or user does not exist.',
      401: 'Unauthorized access. Please try again later.',
      404: 'User not found. Please check the email address.',
      429: 'Too many requests. Please wait a moment and try again.',
    };

    toast({
      title: "Forgot Password Error",
      description: errorMessages[status] || message || 'An error occurred during the password reset process.',
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
      containerStyle: { maxWidth: toastWidth },
    });
  };

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.8)" />
      <ModalContent maxWidth={{ base: '90%', md: '500px' }}>
        <ModalHeader fontSize={{ base: 'lg', md: 'xl' }}>Forgot Password</ModalHeader>
        <Divider />
        <ModalCloseButton size={{ base: 'sm', md: 'md' }} />

        <ModalBody mt={4}>
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="email" isInvalid={!!(formik.touched.email && formik.errors.email)}>
              <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter your email"
                size={{ base: 'md', md: 'md' }}
                isRequired
              />
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: 'red', fontSize: 'smaller' }}>
                  {formik.errors.email}
                </div>
              )}
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            size={{ base: 'sm', md: 'md' }}
            onClick={() => formik.handleSubmit()}
            isLoading={formik.isSubmitting}
            loadingText="Please wait.."
            isDisabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
          >
            Send Reset Link
          </Button>
          <Button variant="ghost" onClick={onClose} size={{ base: 'sm', md: 'md' }}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

"use client";
import { useEffect, useState } from 'react';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation'; // Use useRouter for navigation
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null); // Store the reset code safely
  const toast = useToast();
  const router = useRouter();

  // Use breakpoint value to adjust toast width based on screen size
  const toastWidth = useBreakpointValue({ base: '80%', md: 'md' });
  
  // We need to extract the search params safely using 'window.location'
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const resetCode = urlParams.get('code'); // Extract the reset code
      setCode(resetCode);
    }
  }, []);

  const bgcolor1 = useColorModeValue('gray.50', 'gray.800');
  const bgcolor2 = useColorModeValue('white', 'gray.700');

  const handleResetPassword = async (values: { password: string; passwordConfirmation: string }) => {
    if (!code) {
      toast({
        title: 'Error',
        description: 'Invalid or missing reset code.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        containerStyle: { maxWidth: toastWidth },
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, ...values }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Password has been reset successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
          containerStyle: { maxWidth: toastWidth },
        });
        router.push('/signin'); // Redirect to sign-in page
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Unable to reset password.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          containerStyle: { maxWidth: toastWidth },
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error, please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        containerStyle: { maxWidth: toastWidth },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!code) {
    // Render nothing until the code is available
    return null;
  }

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'} bg={bgcolor1}>
      <Stack spacing={8} mx={'auto'} maxW={'xl'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'2xl'}>Reset Password</Heading>
        </Stack>
        <Box rounded={'lg'} bg={bgcolor2} boxShadow={'lg'} p={10}>
          <Formik
            initialValues={{ password: '', passwordConfirmation: '' }}
            validationSchema={Yup.object({
              password: Yup.string()
                .required('New password is required')
                .min(8, 'Password must be at least 8 characters'),
              passwordConfirmation: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords does not match')
                .required('Password confirmation is required'),
            })}
            onSubmit={handleResetPassword}
          >
            {({ errors, touched }) => (
              <Form>
                <Stack spacing={4}>
                  <FormControl id="password" isInvalid={!!errors.password && touched.password}>
                    <FormLabel>New Password</FormLabel>
                    <Field
                      as={Input}
                      type="password"
                      fontSize="sm"
                      name="password"
                      placeholder="Enter new password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id="passwordConfirmation"
                    isInvalid={!!errors.passwordConfirmation && touched.passwordConfirmation}
                  >
                    <FormLabel>Confirm New Password</FormLabel>
                    <Field
                      as={Input}
                      type="password"
                      fontSize="sm"
                      name="passwordConfirmation"
                      placeholder="Confirm new password"
                    />
                    <FormErrorMessage>{errors.passwordConfirmation}</FormErrorMessage>
                  </FormControl>
                  <Stack spacing={10}>
                    <Button
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{ bg: 'blue.500' }}
                      type="submit"
                      isLoading={loading}
                    >
                      Reset Password
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
}

'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  FormErrorMessage,
  Spinner,
  useToast, // Import useToast
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'

interface SignInFormValues {
  ecode: string;
  password: string;
  rememberMe: boolean;
}

const SignInSchema = Yup.object().shape({
  ecode: Yup.number()
    .typeError('Must be a number')
    .integer('Must be an integer')
    .min(1000, 'Must be at least 4-digit')
    .max(9999, 'Must be at most 4-digit')
    .required('Employee code is required'),
  password: Yup.string()
    .required('Password is required'),
});

export default function SignInPage() {

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const toast = useToast(); // Initialize useToast

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  const handleSignIn = async (values: SignInFormValues) => {
    setLoading(true); // Show spinner

    try {
      const response = await fetch(`${baseUrl}/api/auth/login-employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ecode: values.ecode, // Using ecode as the identifier
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token
        localStorage.setItem('token', data.jwt);
        //localStorage.setItem('user', JSON.stringify(data.user));

        // Show success toast
        toast({
          title: "Login successful",
          description: "You have successfully logged in.",
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "top",
        });

        // Wait for the toast to be visible before redirecting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to the dashboard
        router.push('/dashboard');

      } else if (response.status === 400) {
        toast({
          title: "Login Error",
          description: 'User not found',
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (response.status === 401) {
        toast({
          title: "Login Error",
          description: 'Incorrect Password',
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "An error occurred",
          description: data.message || 'Sign-in failed',
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error('Sign-in failed:', error);
      toast({
        title: "Network Error",
        description: 'An unexpected error occurred. Please try again.',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      backgroundImage="url('/Kameng_river.jpeg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Stack
        spacing={8}
        mx={'auto'}
        maxW={'lg'}
        py={12}
        px={6}
        opacity={0.9}
      >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={'white'}>Login</Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Formik
            initialValues={{ ecode: '', password: '', rememberMe: false }}
            validationSchema={SignInSchema}
            onSubmit={handleSignIn}
          >
            {({ errors, touched }) => (
              <Form>
                <Stack spacing={4}>
                  <FormControl id="ecode" isInvalid={!!errors.ecode && touched.ecode}>
                    <FormLabel>Employee Code</FormLabel>
                    <Field as={Input} type="text" name="ecode" placeholder="xxxx" autoFocus />
                    <FormErrorMessage>{errors.ecode}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="password" isInvalid={!!errors.password && touched.password}>
                    <FormLabel>Password</FormLabel>
                    <Field as={Input} type="password" name="password" />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={{ base: 'column', sm: 'row' }}
                      align={'start'}
                      justify={'space-between'}>
                      <Field as={Checkbox} name="rememberMe">
                        Remember me
                      </Field>
                      <Text color={'blue.400'}>Forgot password?</Text>
                    </Stack>
                    {loading ? (
                      <Flex justifyContent="center" alignItems="center">
                        <Spinner size="md" color="blue.400" />
                      </Flex>
                    ) : (
                      <Button
                        type="submit"
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                      >
                        Sign in
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Stack>
    </Flex>
  )
}

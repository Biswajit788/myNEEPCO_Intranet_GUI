"use client"
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
  useToast,
  useDisclosure,
  useBreakpointValue
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

interface SignInFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

const SignInSchema = Yup.object().shape({
  username: Yup.number()
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Use breakpoint value to adjust toast width based on screen size
  const toastWidth = useBreakpointValue({ base: '80%', md: 'md' });

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  const handleSignIn = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/login-employee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.jwt);
        toast({
          title: "Login successful",
          description: "You have successfully logged in.",
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/dashboard');
      } else {
        handleErrors(response.status, data.message);
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: 'An unexpected error occurred. Please try again.',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleErrors = (status: number, message: string) => {
    if (status === 400) {
      toast({
        title: "Login Error",
        description: 'User does not exist',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth },
      });
    } else if (status === 401) {
      toast({
        title: "Login Error",
        description: 'Incorrect Password',
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth },
      });
    } else {
      toast({
        title: "An error occurred",
        description: message || 'Sign-in failed',
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
        containerStyle: { maxWidth: toastWidth },
      });
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
        ml={'auto'}
        maxW={'lg'}
        py={12}
        px={6}
        opacity={0.9}
        w={'full'}
      >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={'white'}>Login</Heading>
        </Stack>
        <Box
          rounded={'md'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          width="100%"
          maxW="sm"
          mx="auto"
        >
          <Formik
            initialValues={{ username: '', password: '', rememberMe: false }}
            validationSchema={SignInSchema}
            onSubmit={handleSignIn}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form>
                <Stack spacing={4}>
                  <FormControl id="username" isInvalid={!!errors.username && touched.username} p={0} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Field as={Input} type="text" name="username" placeholder="xxxx"/>
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="password" isInvalid={!!errors.password && touched.password} p={0} isRequired>
                    <FormLabel>Password</FormLabel>
                    <Field as={Input} type="password" name="password"/>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Stack spacing={10}>
                    <Stack
                      direction={'column'}
                      align={'end'}
                      spacing={1}
                    >
                      <Field as={Checkbox} name="rememberMe">
                        Remember me
                      </Field>
                      <Text color={'blue.400'} cursor="pointer" onClick={onOpen}>
                        Forgot password?
                      </Text>

                      <Link href="/signup" passHref>
                        <Text color="blue.400" _hover={{ textDecoration: 'underline' }}>
                          Sign up
                        </Text>
                      </Link>
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
                        isDisabled={!(isValid && dirty)}
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

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { registerUser } from '@/services/api';

interface SignupFormValues {
  firstname: string;
  lastname: string;
  username: string;
  dob: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const SignupSchema = Yup.object().shape({
    firstname: Yup.string().required('First Name is required'),
    lastname: Yup.string().required('Last Name is required'),
    username: Yup.string()
      .required('Username is required')
      .max(4, "More than 4-digit not allowed")
      .min(4, "Less than 4-digit not allowed"),
    dob: Yup.date().required('Date of Birth is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords does not match')
      .required('Confirm Password is required')
  });

  const initialValues: SignupFormValues = {
    firstname: '',
    lastname: '',
    username: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (values: SignupFormValues, { setSubmitting, resetForm }: any) => {
    try {
      const response = await registerUser(values);
      if (response) {
        window.alert('User account created successfully!!');
        resetForm();
        setTimeout(() => {
          router.push('/signin');
        }, 2000); // Redirect after 2 seconds
      }
    } catch (error: any) {
      const errorMessage = error.message;
      window.alert(`Registration failed: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
      backgroundImage="url('/AGTCCP.jpg')"
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} opacity={0.9}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} color={'whitesmoke'}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>

          <Formik
            initialValues={initialValues}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isValid, dirty }) => (
              <Form>
                <Stack spacing={4}>
                  <HStack>
                    <Box>
                      <FormControl id="firstname" isInvalid={!!errors.firstname && touched.firstname} isRequired>
                        <FormLabel>First Name</FormLabel>
                        <Field as={Input} type="text" name="firstname" />
                        <FormErrorMessage>{errors.firstname}</FormErrorMessage>
                      </FormControl>
                    </Box>
                    <Box>
                      <FormControl id="lastname" isInvalid={!!errors.lastname && touched.lastname} isRequired>
                        <FormLabel>Last Name</FormLabel>
                        <Field as={Input} type="text" name="lastname" />
                        <FormErrorMessage>{errors.lastname}</FormErrorMessage>
                      </FormControl>
                    </Box>
                  </HStack>
                  <FormControl id="username" isInvalid={!!errors.username && touched.username} isRequired>
                    <FormLabel>Username</FormLabel>
                    <Field as={Input} type="text" name="username" placeholder="4-digit employee code" />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="dob" isInvalid={!!errors.dob && touched.dob} isRequired>
                    <FormLabel>Date of Birth</FormLabel>
                    <Field 
                      as={Input} 
                      type="date" 
                      name="dob" 
                      size="sm" 
                      placeholder="Birthday Date" 
                      textTransform="uppercase" 
                      max={getCurrentDate()} // Disable future dates
                    />
                    <FormErrorMessage>{errors.dob}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="email" isInvalid={!!errors.email && touched.email} isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Field as={Input} type="email" name="email" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="password" isInvalid={!!errors.password && touched.password} isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Field as={Input}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        sx={{
                          '::-ms-reveal, ::-ms-clear, ::-webkit-contacts-auto-fill-button, ::-webkit-password-toggle': {
                            display: 'none',
                          },
                        }}
                      />
                      <InputRightElement h={'full'}>
                        <Button
                          variant={'ghost'}
                          onClick={() => setShowPassword((showPassword) => !showPassword)}>
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword && touched.confirmPassword} isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                      <Field
                        as={Input}
                        type="password"
                        name="confirmPassword"
                        sx={{
                          '::-ms-reveal, ::-ms-clear, ::-webkit-contacts-auto-fill-button, ::-webkit-password-toggle': {
                            display: 'none',
                          },
                        }}
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                  </FormControl>
                  <Stack spacing={10} pt={2}>
                    <Button
                      loadingText="Submitting"
                      size="lg"
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}
                      type="submit"
                      isDisabled={!(isValid && dirty)} // Disable button if form is not valid or not dirty
                    >
                      Register
                    </Button>
                  </Stack>
                  <Stack pt={6}>
                    <Text align={'center'}>
                      Already a user? <Link color={'blue.400'} href="/signin">Login</Link>
                    </Text>
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

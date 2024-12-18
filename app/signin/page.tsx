"use client";
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
import { useEffect, useState, useRef } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from '@/components/ForgotPasswordModal';

interface SignInFormValues {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface OtpFormValues {
  otp: string;
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

const OtpSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
});

export default function SignInPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [userData, setUserData] = useState<SignInFormValues | null>(null);
  const toast = useToast();

  const toastWidth = useBreakpointValue({ base: '80%', md: 'md' });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    setTimerActive(true); // Set timer active
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current!); // Clear the timer
          setTimerActive(false); // Mark timer as inactive
          setResendDisabled(false); // Enable resend button when time is up
          return 0; // Ensure countdown doesn't go negative
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    router.prefetch('/dashboard');
  }, [router]);

  useEffect(() => {
    if (otpSent) {
      startCountdown(); // Start the countdown when OTP is sent

      // Cleanup function to clear interval when the component unmounts or otpSent changes
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current); // Clear the timer
        }
      };
    }
  }, [otpSent]);

  const handleSignIn = async (values: SignInFormValues) => {
    console.log('Sign In Values:', values);
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
        setUserData(values); // Store user data
        setOtpSent(true); // Proceed to OTP form
        setCountdown(120); // Reset countdown
        toast({
          title: "OTP sent",
          description: "A One-Time Password has been sent to your email.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
      } else {
        // Show the error code and message
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

  const handleErrors = (errorCode: number, errorMessage: string) => {
    switch (errorCode) {
      case 400:
        // Bad Request (e.g., missing credentials)
        toast({
          title: "Invalid Credentials",
          description: "User does not exist",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
        break;
      case 401:
        // Unauthorized (e.g., invalid password)
        toast({
          title: "Unauthorized",
          description: "Invalid password",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
        break;
      case 429:
        // Too Many Requests (e.g., account locked due to too many failed attempts)
        toast({
          title: "Account Locked",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
        break;
      case 500:
        // Internal Server Error
        toast({
          title: "Internal Server Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
        break;
      default:
        // Generic error
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
    }
  };

  const handleOtpVerification = async (values: OtpFormValues) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData?.username,
          otp: values.otp,
        }),
      });

      const data = await response.json();

      // Check for response status
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
        // Handle specific error statuses
        if (response.status === 401) {
          toast({
            title: "Authentication Failed",
            description: "The OTP you entered is invalid or has expired.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
            containerStyle: { maxWidth: toastWidth },
          });
        } else {
          // Handle other errors
          handleErrors(response.status, data.message);
        }
      }
    } catch (error) {
      console.error("Network Error:", error);
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


  const handleResendOtp = async () => {
    setLoading(true);

    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear existing timer
    }
    setCountdown(120); // Reset countdown
    setResendDisabled(true); // Disable resend button immediately
    try {
      // Call the API to resend the OTP
      const response = await fetch(`${baseUrl}/api/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData?.username, // Pass the username from userData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Start the countdown timer
        startCountdown();

        toast({
          title: "OTP Resent",
          description: "A new OTP has been sent to your email.",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top",
          containerStyle: { maxWidth: toastWidth },
        });
      } else {
        handleErrors(response.status, data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        title: "Network Error",
        description: 'An unexpected error occurred while resending the OTP. Please try again.',
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
        py={10}
        px={6}
        opacity={0.9}
        w={'full'}
      >
        <Stack align={'center'}>
          <Heading fontSize={'3xl'} color={'white'}>{otpSent ? 'Enter OTP' : 'Login'}</Heading>
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
          {otpSent ? (
            // OTP Form
            <Formik
              initialValues={{ otp: '' }}
              validationSchema={OtpSchema}
              onSubmit={handleOtpVerification}
            >
              {({ values, errors, touched, isValid, dirty }) => (
                <Form>
                  <Stack spacing={4}>
                    <FormControl id="otp" isInvalid={!!errors.otp && touched.otp} p={0} isRequired>
                      <FormLabel>OTP</FormLabel>
                      <Field
                        as={Input}
                        type="text"
                        name="otp"
                        placeholder="xxxxxx"
                        autoComplete="off"
                        value={values.otp || ''}
                      />
                      <FormErrorMessage>{errors.otp}</FormErrorMessage>
                    </FormControl>
                    <Stack spacing={5}>
                      <Text fontSize={'sm'} fontWeight="bold" color="gray.600">
                        {timerActive
                          ? `Resend in ${Math.floor(countdown / 60)}:${('0' + (countdown % 60)).slice(-2)}`
                          : "OTP expired. Please resend."}
                      </Text>
                      {/* Verify OTP Button */}
                      {timerActive ? (
                        <Button
                          type="submit"
                          bg={'blue.400'}
                          color={'white'}
                          _hover={{
                            bg: 'blue.500',
                          }}
                          isDisabled={!(isValid && dirty) || loading} // Disable if form is invalid, not dirty, or loading is true
                          isLoading={loading}
                          loadingText="Please wait.."
                        >
                          <Flex alignItems="center">
                            Verify OTP
                            {loading && <Spinner size="sm" color="white" ml={2} />}
                          </Flex>
                        </Button>
                      ) : null}

                      {/* Resend OTP Button */}
                      {!timerActive && (
                        <Button
                          onClick={handleResendOtp}
                          bg={'red.400'}
                          color={'white'}
                          _hover={{
                            bg: 'red.500',
                          }}
                          isDisabled={loading} // Disable if loading is true
                          isLoading={loading}
                          loadingText="Please wait..."
                        >
                          <Flex alignItems="center">
                            Resend OTP
                            {loading && <Spinner size="sm" color="white" ml={2} />}
                          </Flex>
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>

          ) : (
            // Sign-In Form
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
                      <Field
                        as={Input}
                        type="text"
                        name="username"
                        placeholder="xxxx"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>
                    <FormControl id="password" isInvalid={!!errors.password && touched.password} p={0} isRequired>
                      <FormLabel>Password</FormLabel>
                      <Field as={Input} type="password" name="password" placeholder="******" autoComplete="off" />
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <Stack spacing={10} fontSize={'md'}>
                      <Stack direction={'column'} align={'end'} spacing={1}>
                        <Field as={Checkbox} name="rememberMe">Remember me</Field>
                        <Text color={'blue.400'} cursor="pointer" onClick={onOpen}>
                          Forgot password?
                        </Text>
                        <Stack direction={'row'}>
                          <Text>Not registered?</Text>
                          <Link href="/signup" passHref>
                            <Text color="blue.400" _hover={{ textDecoration: 'underline' }}>
                              Register
                            </Text>
                          </Link>
                        </Stack>
                      </Stack>
                      <Button
                        type="submit"
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}
                        isDisabled={!(isValid && dirty) || loading} // Disable if loading is true
                        isLoading={loading}
                        loadingText="Please wait..."
                      >
                        <Flex alignItems="center">
                          Sign In
                          {loading && <Spinner size="sm" color="white" ml={2} />}
                        </Flex>
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Stack>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}

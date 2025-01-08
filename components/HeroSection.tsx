'use client';

import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  IconButton,
  createIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiLogIn } from "react-icons/fi";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  const textColor = useColorModeValue("gray.700", "gray.100");

  return (
    <Box
      position="relative"
      w="full"
      h={{ base: '100vh', md: '80vh' }}
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        bgImage="url('/kameng_dam.jpg')"
        bgSize="cover"
        bgPosition="center"
        zIndex={-1}
        opacity={0.1}
      />
      <Container maxW={'7xl'} h="full">
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', md: 'row' }}
          h="full"
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'blue.400',
                  zIndex: -1,
                }}
              >
                Welcome to,
              </Text>
              <br />
              <Text
                as={'span'}
                color={'blue.300'}
                textOverflow={'ellipsis'}
                whiteSpace={'nowrap'}
              >
                MyNEEPCO INTRANET
              </Text>
            </Heading>
            <Text color={textColor} fontSize={'sm'} textAlign={"justify"}>
              The NEEPCO portal, developed by the IT Department of NEEPCO Ltd, serves as a vital resource for employees,
              providing easy access to online tools and information. Through this portal, employees can conveniently check
              Transfer and Posting orders, Seniority Lists, Promotion orders, and Vigilance reports. Additionally, it keeps
              them informed with the latest News and Circulars issued by the Competent Authority.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Button
                rounded={'full'}
                size={'sm'}
                fontWeight={'normal'}
                px={6}
                colorScheme={'red'}
                bg={'blue.400'}
                _hover={{ bg: 'red.500' }}
              >
                <Link href="https://neepco.co.in/" target="_blank" rel="noopener noreferrer">
                  Visit NEEPCO Website
                </Link>

              </Button>
              <Button
                rounded={'full'}
                size={'sm'}
                fontWeight={'normal'}
                px={6}
                leftIcon={<FiLogIn color={'gray.500'} />}
                _hover={{ bg: 'red.500' }}
              >
                <Link href="/signin" passHref>
                  Intranet Login
                </Link>
              </Button>
            </Stack>
          </Stack>
          <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
            <Box
              position={'relative'}
              zIndex={-1}
              opacity="0.8"
              boxShadow={'0 2px 4px rgba(0, 0, 0, 0.5)'}
              borderRightRadius="xl"
              width={'full'}
              overflow={'hidden'}
            >
              <video
                controls
                autoPlay
                muted
                loop
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  display: 'block',
                  margin: '0 auto',
                  pointerEvents: 'none',
                }}
              >
                <source src={'/KamengVideo.mp4'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
}

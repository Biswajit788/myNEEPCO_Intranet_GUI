'use client'

import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

const Testimonial = (props: Props) => {
  const { children } = props

  return <Box>{children}</Box>
}

const TestimonialContent = (props: Props) => {
  const { children } = props

  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'lg'}
      p={8}
      rounded={'xl'}
      align={'center'}
      pos={'relative'}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: 'solid transparent',
        borderLeftWidth: 16,
        borderRight: 'solid transparent',
        borderRightWidth: 16,
        borderTop: 'solid',
        borderTopWidth: 16,
        borderTopColor: useColorModeValue('white', 'gray.800'),
        pos: 'absolute',
        bottom: '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}>
      {children}
    </Stack>
  )
}

const TestimonialHeading = (props: Props) => {
  const { children } = props

  return (
    <Heading as={'h3'} fontSize={'xl'}>
      {children}
    </Heading>
  )
}

const TestimonialText = (props: Props) => {
  const { children } = props

  return (
    <Text
      textAlign={'center'}
      color={useColorModeValue('gray.600', 'gray.400')}
      fontSize={'sm'}>
      {children}
    </Text>
  )
}

const TestimonialAvatar = ({
  src,
  name,
  title,
}: {
  src: string
  name: string
  title: string
}) => {
  return (
    <Flex align={'center'} mt={8} direction={'column'}>
      <Avatar
        src={src}
        mb={4}
        objectFit="cover"
        w="200px"  // Set the width of the avatar
        h="200px"  // Set the height of the avatar
        borderRadius="full" // Make the avatar circular
      />
      <Stack spacing={-1} align={'center'}>
        <Text fontWeight={600} fontSize="md">{name}</Text>
        <Text fontSize={'sm'} color={useColorModeValue('gray.600', 'gray.400')}>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}

export default function Testimonials() {
  return (
    <Box bg={useColorModeValue('gray.100', 'gray.700')}>
      <Container maxW={'7xl'} py={16} as={Stack} spacing={12}>

        {/* Heading Section */}
        <Stack spacing={0} align={'center'}>
          <Heading>NEEPCO LEADERS</Heading>
          <Text>Chairman & Managing Director and Functional Director</Text>
        </Stack>
        {/* Parent Testimonial Section */}
        <Flex justify="center" align="center" direction={{ base: 'column', md: 'row' }} wrap="wrap">
        <Stack spacing={0} align={'center'} mb={8}>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>CMD</TestimonialHeading>
              <TestimonialText>
                NEEPCO Ltd, Lower New Colony, Shillong-793003
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                '/CMD.png'
              }
              name={'Shri. Gurdeep Singh'}
              title={'Chairman & Managing Director (Additional Charge)'}
            />
          </Testimonial>
        </Stack>

        {/* Child Testimonials Section */}
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 10, md: 4, lg: 10 }}>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Director(Technical)</TestimonialHeading>
              <TestimonialText>
                NEEPCO Ltd, Lower New Colony, Shillong-793003
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                '/DT.png'
              }
              name={'Shri. Ranendra Sarma'}
              title={'Director(Technical)'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Director(Finance)</TestimonialHeading>
              <TestimonialText>
                NEEPCO Ltd, Lower New Colony, Shillong-793003
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                '/DF.png'
              }
              name={'Shri. Baidyanath Maharana'}
              title={'Director(Finance)'}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Director(Personnel)</TestimonialHeading>
              <TestimonialText>
                NEEPCO Ltd, Lower New Colony, Shillong-793003
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                '/DP.png'
              }
              name={'Maj Gen Rajesh Kumar Jha, AVSM **(retd)'}
              title={'Director(Personnel)'}
            />
          </Testimonial>
        </Stack>
        </Flex>
      </Container>
    </Box>
  )
}

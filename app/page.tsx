import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Feature1 from "@/components/Feature1";
import Feature2 from "@/components/Feature2";
import Testimonials from "@/components/Testimonials";
import { Box, Flex } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" overflow="hidden">
      <Navbar />
      <Flex flex={1} direction="column">
        <HeroSection />
        <Testimonials />
        <Footer />
      </Flex>
    </Box>
  );
}

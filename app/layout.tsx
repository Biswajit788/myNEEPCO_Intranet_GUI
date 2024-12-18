import type { Metadata } from "next";
import { ChakraProvider } from '@chakra-ui/react';
import './globals.css';

export const metadata: Metadata = {
  title: "NEEPCO INTRANET",
  description: "Welcome to myNeepco intranet portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="icon" href="/nextjs-icon.svg" />
        <title>NEEPCO INTRANET</title>
      </head>
      <body>
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}

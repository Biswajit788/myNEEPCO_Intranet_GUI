'use client';

import React, { useState } from 'react';
import { Grid, GridItem, Box, Image, Button, IconButton } from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';
import { CloseIcon } from '@chakra-ui/icons';

const images = [
    '/logo170.gif',
    '/swacchlogo.png',
    '/CMD.png',
    '/DF.png',
    '/DT.png',
    '/DP.png',
    '/kameng_dam.jpg',
    '/neepco-logo.png',
    '/PH_KaHEP.jpg',
];

const PhotoPage = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleOpenPopup = (src: string) => {
        setSelectedImage(src);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedImage(null);
    };

    const handleDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Box p={5}>
            <Grid
                templateColumns={{
                    base: 'repeat(2, 1fr)', // 2 columns on small screens
                    md: 'repeat(3, 1fr)',  // 3 columns on medium screens
                    lg: 'repeat(5, 1fr)',  // 4 columns on large screens
                }}
                gap={6}
            >
                {images.map((src, index) => (
                    <GridItem
                        key={index}
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        overflow="hidden"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        height="150px" // Fixed height for grid items
                        p={2}
                    >
                        <Box
                            flex="1"
                            overflow="hidden"
                            onClick={() => handleOpenPopup(src)}
                            cursor="pointer"
                        >
                            <Image
                                src={src}
                                alt={`Image ${index + 1}`}
                                objectFit="contain"
                                width="100%"
                                height="100%"
                            />
                        </Box>
                        <Box pt={2} textAlign="center">
                            <Button
                                leftIcon={<FiDownload />}
                                colorScheme="blue"
                                size="xs"
                                onClick={() => handleDownload(src)}
                            >
                                Download
                            </Button>
                        </Box>
                    </GridItem>
                ))}
            </Grid>

            {/* Popup for viewing image */}
            {isPopupOpen && selectedImage && (
                <Box
                    position="fixed"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    backgroundColor="rgba(0, 0, 0, 0.8)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    onClick={handleClosePopup}
                    zIndex="9999"
                >
                    <Image
                        src={selectedImage}
                        alt="Selected Image"
                        width="50%"  // Ensures the image fits within the box width
                        height="50%" // Ensures the image fits within the box height
                        objectFit="contain" // Ensures the image maintains aspect ratio
                    />
                    <IconButton
                        position="absolute"
                        top="10px"
                        right="10px"
                        colorScheme="white"
                        aria-label="Close"
                        icon={<CloseIcon />}
                        onClick={handleClosePopup}
                    />

                </Box>
            )}
        </Box>
    );
};

export default PhotoPage;

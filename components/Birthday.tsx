import { useState, useEffect } from 'react';
import { Box, Stack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import List from '@/components/BirthdayList';
import axios from 'axios';

// Define the URL for your Strapi backend endpoint
const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`;

export default function Home() {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const response = await axios.get(API_URL);
                const users = response.data;              
                // Map the response to the required format
                const formattedUsers = users.map((user: any) => ({
                    id: user.id,
                    name: `${user.firstname} ${user.lastname}`,
                    birthday: user.dob,
                    image: '/user.png'
                }));
                
                setPeople(formattedUsers);
            } catch (error) {
                console.error('Error fetching data', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchPeople();
    }, []);

    const bgColor = useColorModeValue('red.50', 'gray.900');  // Light mode = red.50, Dark mode = gray.800
    const cardBgColor = useColorModeValue('white', 'gray.700');  // Light mode = white, Dark mode = gray.700
    const textColor = useColorModeValue('gray.900', 'white'); // Light mode = dark text, Dark mode = white text

    if (loading) {
        return <Box>Loading...</Box>;
    }

    if (error) {
        return <Box>Error: {error}</Box>;
    }

    return (
        <Box
            alignItems="center"
            bg={bgColor}
            p={{ base: 4, md: 6 }} 
            rounded="md"
            minH={600}
        >
            <Box 
                bg={cardBgColor} 
                color={textColor} 
                p={{ base: 4, md: 6 }}
                borderRadius="md" 
                boxShadow="lg" 
                width={{ base: "full", sm: "md", md: "400px" }}
                maxW="full"
            >
                <Stack>
                    <List people={people} />
                </Stack>
            </Box>
        </Box>
    );
}

// Define the Person interface for TypeScript
interface Person {
    id: number;
    name: string;
    birthday: string;
    image: string;
}

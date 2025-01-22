import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Stack, useColorMode, useColorModeValue } from '@chakra-ui/react';
import List from '@/components/BirthdayList';
import axios from 'axios';

// Define the Person interface for TypeScript
interface Person {
    id: number;
    name: string;
    birthday: string;
    image: string;
    username: string;
}

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
                    image: '/user.png',
                    username: user.username,
                }));

                setPeople(formattedUsers);
            } catch (error) {
                console.error('Error fetching data', error);
                setError('Error fetching Birthday');
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
        return(
            <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertTitle mr={2}>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <List people={people} />
    );
}
import { Box, Divider, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';

// Function to format the date with the current year
const formatDateWithCurrentYear = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);

    // Create a new date object with the current year and the birthdate's month and day
    const currentYear = today.getFullYear();
    const upcomingBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());

    // Format the date as month, day, and year
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return upcomingBirthday.toLocaleDateString(undefined, options);
};

const isBirthdayToday = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);

    return (
        today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth()
    );
};

const isUpcomingBirthdayThisMonth = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);

    const currentMonth = today.getMonth();
    const birthMonth = birthDate.getMonth();

    return (
        birthMonth === currentMonth &&
        (birthDate.getDate() > today.getDate() || (birthDate.getDate() === today.getDate() && birthDate.getFullYear() > today.getFullYear()))
    );
};

interface Person {
    id: number;
    name: string;
    birthday: string;
    image: string;
    username: string;
}

const BirthdayList = ({ people }: { people: Person[] }) => {
    const peopleWithTodayBirthday = people.filter((person) => isBirthdayToday(person.birthday));

    // Get upcoming birthdays this month
    const upcomingBirthdaysThisMonth = people.filter((person) => isUpcomingBirthdayThisMonth(person.birthday));

    // Sort upcoming birthdays by date
    upcomingBirthdaysThisMonth.sort((a, b) => {
        const today = new Date();
        const aDate = new Date(today.getFullYear(), new Date(a.birthday).getMonth(), new Date(a.birthday).getDate());
        const bDate = new Date(today.getFullYear(), new Date(b.birthday).getMonth(), new Date(b.birthday).getDate());
        return aDate.getTime() - bDate.getTime();
    });

    const cardBgColor = useColorModeValue('white', 'gray.700');

    return (
        <Flex direction={{ base: 'column', md: 'column' }} gap={4}>
            {/* Card for Today’s Birthdays */}
            <Box flex="1" boxShadow="lg" borderRadius="md" p={4} bg={cardBgColor}>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    {peopleWithTodayBirthday.length} Birthday{peopleWithTodayBirthday.length !== 1 ? 's' : ''} today
                </Text>
                {/* Show the birthday message only if there is at least one birthday */}
                {peopleWithTodayBirthday.length > 0 && (
                    <Box mb={4} p={4} bg="yellow.200" borderRadius="md" textAlign="center">
                        <Text fontSize="lg" fontWeight="bold">
                            🎉 {peopleWithTodayBirthday.length === 1 ? 'Happy Birthday to our wonderful birthday star!' : 'Happy Birthday to all our wonderful birthday stars!'} 🎉
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            {peopleWithTodayBirthday.length === 1
                                ? 'Wishing you a day filled with love, joy, and wonderful memories!'
                                : 'Wishing you all a day filled with love, joy, and wonderful memories!'}
                        </Text>
                    </Box>
                )}

                <Divider />
                {peopleWithTodayBirthday.length === 0 ? (
                    <Text>No birthdays today.</Text>
                ) : (
                    peopleWithTodayBirthday.map((person) => {
                        const { id, name, image, username } = person;

                        return (
                            <Flex key={id} mb={4} align="center" mt="6">
                                <Image
                                    borderRadius="full"
                                    boxSize="40px"
                                    src={image}
                                    alt={name}
                                    mr={4}
                                />
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm">{name}</Text>
                                    <Text color="gray.500" fontSize={'xs'}>Ecode: {username}</Text>
                                </Box>
                            </Flex>
                        );
                    })
                )}
            </Box>

            {/* Card for Upcoming Birthdays This Month */}
            <Box flex="1" boxShadow="lg" borderRadius="md" p={4} bg={cardBgColor}>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Upcoming Birthday{upcomingBirthdaysThisMonth.length !== 1 ? 's' : ''} this month
                </Text>
                <Divider my={4} />
                {upcomingBirthdaysThisMonth.length === 0 ? (
                    <Text>No upcoming birthdays this month.</Text>
                ) : (
                    upcomingBirthdaysThisMonth.map((person) => {
                        const { id, name, birthday, image, username } = person;
                        const formattedDate = formatDateWithCurrentYear(birthday);

                        return (
                            <Flex key={id} mb={4} align="center" mt="2">
                                <Image
                                    borderRadius="full"
                                    boxSize="40px"
                                    src={image}
                                    alt={name}
                                    mr={4}
                                />
                                <Box>
                                    <Text fontWeight="bold" fontSize="sm">{name}</Text>
                                    <Text color="gray.500" fontSize={'xs'}>Ecode: {username}</Text>
                                    <Text color="gray.400" fontSize={'xs'}>{formattedDate}</Text>
                                </Box>
                            </Flex>
                        );
                    })
                )}
            </Box>
        </Flex>
    );
};

export default BirthdayList;

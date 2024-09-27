import { Box, Divider, Flex, Image, Text } from '@chakra-ui/react';

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

const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
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

    return (
        <Box>
            {/* Today’s Birthdays */}
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                {peopleWithTodayBirthday.length} Birthday{peopleWithTodayBirthday.length !== 1 ? 's' : ''} today
            </Text>
            <Divider />
            {peopleWithTodayBirthday.length === 0 ? (
                <Text>No birthdays today.</Text>
            ) : (
                peopleWithTodayBirthday.map((person) => {
                    const { id, name, birthday, image } = person;
                    const age = calculateAge(birthday);

                    return (
                        <Flex key={id} mb={4} align="center" mt="6">
                            <Image
                                borderRadius="full"
                                boxSize="50px"
                                src={image}
                                alt={name}
                                mr={4}
                            />
                            <Box>
                                <Text fontWeight="bold" fontSize="sm">{name}</Text>
                                <Text color="gray.500" fontSize={'xs'}>{age} years old</Text>
                            </Box>
                        </Flex>
                    );
                })
            )}

            {/* Upcoming Birthdays This Month */}
            <Divider my={6} />
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                Upcoming Birthday{upcomingBirthdaysThisMonth.length !== 1 ? 's' : ''} this month
            </Text>
            {upcomingBirthdaysThisMonth.length === 0 ? (
                <Text>No upcoming birthdays this month.</Text>
            ) : (
                upcomingBirthdaysThisMonth.map((person) => {
                    const { id, name, birthday, image } = person;
                    const age = calculateAge(birthday);
                    const formattedDate = formatDateWithCurrentYear(birthday);

                    return (
                        <Flex key={id} mb={4} align="center" mt="6">
                            <Image
                                borderRadius="full"
                                boxSize="50px"
                                src={image}
                                alt={name}
                                mr={4}
                            />
                            <Box>
                                <Text fontWeight="bold" fontSize="sm">{name}</Text>
                                <Text color="gray.500" fontSize={'xs'}>{age} years old</Text>
                                <Text color="gray.400" fontSize={'xs'}>{formattedDate}</Text>
                            </Box>
                        </Flex>
                    );
                })
            )}
        </Box>
    );
};

export default BirthdayList;

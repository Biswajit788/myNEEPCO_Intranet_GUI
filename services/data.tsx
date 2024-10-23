const data = [
    { id: 1, name: 'John Doe', birthday: '1990-09-13', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', birthday: '1985-05-22', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 3, name: 'Alice Johnson', birthday: '2000-11-05', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 4, name: 'Michael Brown', birthday: '1995-04-15', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: 5, name: 'Emily Davis', birthday: '1989-09-13', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: 6, name: 'Robert Miller', birthday: '1992-03-23', image: 'https://randomuser.me/api/portraits/men/3.jpg' },
    { id: 7, name: 'Sophia Wilson', birthday: '1997-12-30', image: 'https://randomuser.me/api/portraits/women/4.jpg' },
    { id: 8, name: 'James Taylor', birthday: '1983-07-14', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: 9, name: 'Isabella Thomas', birthday: '1994-01-19', image: 'https://randomuser.me/api/portraits/women/5.jpg' },
    { id: 10, name: 'Daniel Moore', birthday: '2001-11-12', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { id: 11, name: 'Olivia Harris', birthday: '1993-02-03', image: 'https://randomuser.me/api/portraits/women/6.jpg' },
    { id: 12, name: 'David Clark', birthday: '1987-10-25', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { id: 13, name: 'Ava Lewis', birthday: '2000-09-13', image: 'https://randomuser.me/api/portraits/women/7.jpg' },
    { id: 14, name: 'Matthew Walker', birthday: '1988-09-28', image: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { id: 15, name: 'Mia Hall', birthday: '1999-11-11', image: 'https://randomuser.me/api/portraits/women/8.jpg' },
    { id: 16, name: 'Christopher Allen', birthday: '1986-06-05', image: 'https://randomuser.me/api/portraits/men/8.jpg' },
    { id: 17, name: 'Amelia Young', birthday: '1995-09-13', image: 'https://randomuser.me/api/portraits/women/9.jpg' },
    { id: 18, name: 'Joshua King', birthday: '1992-11-30', image: 'https://randomuser.me/api/portraits/men/9.jpg' },
    { id: 19, name: 'Charlotte Wright', birthday: '1998-04-04', image: 'https://randomuser.me/api/portraits/women/10.jpg' },
    { id: 20, name: 'Ethan Scott', birthday: '1985-12-15', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
    { id: 21, name: 'Ella Adams', birthday: '1990-10-25', image: 'https://randomuser.me/api/portraits/women/11.jpg' },
    { id: 22, name: 'Logan Baker', birthday: '1994-09-09', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
    { id: 23, name: 'Abigail Green', birthday: '1982-07-12', image: 'https://randomuser.me/api/portraits/women/12.jpg' },
    { id: 24, name: 'Alexander Nelson', birthday: '2001-03-27', image: 'https://randomuser.me/api/portraits/men/12.jpg' },
    { id: 25, name: 'Lily Carter', birthday: '1997-06-16', image: 'https://randomuser.me/api/portraits/women/13.jpg' },
    { id: 26, name: 'Benjamin Mitchell', birthday: '1989-01-05', image: 'https://randomuser.me/api/portraits/men/13.jpg' },
    { id: 27, name: 'Samantha Perez', birthday: '1992-12-12', image: 'https://randomuser.me/api/portraits/women/14.jpg' },
    { id: 28, name: 'William Roberts', birthday: '1996-03-11', image: 'https://randomuser.me/api/portraits/men/14.jpg' },
    { id: 29, name: 'Grace Turner', birthday: '1993-04-14', image: 'https://randomuser.me/api/portraits/women/15.jpg' },
    { id: 30, name: 'Henry Phillips', birthday: '1987-07-20', image: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { id: 31, name: 'Chloe Campbell', birthday: '2000-01-01', image: 'https://randomuser.me/api/portraits/women/16.jpg' },
    { id: 32, name: 'Jack Parker', birthday: '1984-11-03', image: 'https://randomuser.me/api/portraits/men/16.jpg' },
    { id: 33, name: 'Madison Evans', birthday: '1986-02-08', image: 'https://randomuser.me/api/portraits/women/17.jpg' },
    { id: 34, name: 'Ryan Edwards', birthday: '1991-06-22', image: 'https://randomuser.me/api/portraits/men/17.jpg' },
    { id: 35, name: 'Zoey Collins', birthday: '1990-09-25', image: 'https://randomuser.me/api/portraits/women/18.jpg' },
    { id: 36, name: 'Nathan Stewart', birthday: '1988-08-14', image: 'https://randomuser.me/api/portraits/men/18.jpg' },
    { id: 37, name: 'Scarlett Sanchez', birthday: '1999-10-19', image: 'https://randomuser.me/api/portraits/women/19.jpg' },
    { id: 38, name: 'Mason Morris', birthday: '1983-03-07', image: 'https://randomuser.me/api/portraits/men/19.jpg' },
    { id: 39, name: 'Ella White', birthday: '1995-12-24', image: 'https://randomuser.me/api/portraits/women/20.jpg' },
    { id: 40, name: 'Liam Howard', birthday: '1994-04-12', image: 'https://randomuser.me/api/portraits/men/20.jpg' },
    { id: 41, name: 'Avery Ramirez', birthday: '2000-02-05', image: 'https://randomuser.me/api/portraits/women/21.jpg' },
    { id: 42, name: 'Luke Peterson', birthday: '1997-08-08', image: 'https://randomuser.me/api/portraits/men/21.jpg' },
    { id: 43, name: 'Grace Bell', birthday: '1991-09-29', image: 'https://randomuser.me/api/portraits/women/22.jpg' },
    { id: 44, name: 'Owen Murphy', birthday: '1985-01-22', image: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: 45, name: 'Ava Rivera', birthday: '1992-05-06', image: 'https://randomuser.me/api/portraits/women/23.jpg' },
    { id: 46, name: 'Gabriel Morgan', birthday: '1989-08-18', image: 'https://randomuser.me/api/portraits/men/23.jpg' },
    { id: 47, name: 'Sophia Cooper', birthday: '1994-09-18', image: 'https://randomuser.me/api/portraits/women/24.jpg' },
    { id: 48, name: 'Elijah Rogers', birthday: '1991-03-01', image: 'https://randomuser.me/api/portraits/men/24.jpg' },
    { id: 49, name: 'Zoe Reed', birthday: '1998-07-25', image: 'https://randomuser.me/api/portraits/women/25.jpg' },
    { id: 50, name: 'Jackson Cook', birthday: '1993-09-18', image: 'https://randomuser.me/api/portraits/men/25.jpg' },
  ];
  
  export default data;
  
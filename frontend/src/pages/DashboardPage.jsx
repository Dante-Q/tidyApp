import { useContext } from 'react';
import { Button, Container, Title, Text } from '@mantine/core';
import { UserContext } from '../context/UserContext.jsx';

export default function DashboardPage() {
  const { user, logout } = useContext(UserContext);

  return (
    <Container size={600} mt={40}>
      <Title>Welcome, {user.name}!</Title>
      <Text mt="md">Your email: {user.email}</Text>
        <Button mt="xl" color="red" onClick={logout}>
        Logout
        </Button>
    </Container>
  );
}

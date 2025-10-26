// src/pages/HomePage.jsx
import { useState } from 'react';
import { Button, Container, Paper, Title, Text, Transition, Center, Stack } from '@mantine/core';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx';

export default function HomePage() {
  const { user, setUser } = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);

  // Redirect to dashboard if logged in
  if (user) {
    return <DashboardPage />;
  }

  return (
    <Center style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)' }}>
      <Container size={500}>
        <Stack align="center" spacing="xl">
          <Title align="center" color="white" order={1} style={{ textShadow: '2px 2px #2d3436' }}>
            Welcome to TidyApp
          </Title>
          <Text align="center" color="white" size="lg" style={{ textShadow: '1px 1px #2d3436' }}>
            Manage your surf sessions, tides, and more — all in one place.
          </Text>

          <Button 
            size="md" 
            radius="xl" 
            variant="gradient" 
            gradient={{ from: 'teal', to: 'blue', deg: 45 }}
            onClick={() => setShowLogin(true)}
          >
            Login
          </Button>
        </Stack>

        {/* Slide-in login overlay */}
        <Transition mounted={showLogin} transition="slide-left" duration={300} timingFunction="ease">
          {(styles) => (
            <Paper
              style={{ 
                ...styles, 
                position: 'fixed', 
                top: 0, 
                right: 0, 
                height: '100vh', 
                width: '100%', 
                maxWidth: 400, 
                zIndex: 999, 
                backgroundColor: 'white',
                padding: '2rem'
              }}
              shadow="xl"
            >
              <Button mb="md" variant="outline" fullWidth onClick={() => setShowLogin(false)}>
                Close
              </Button>
              <LoginPage onLogin={(u) => { setUser(u); setShowLogin(false); }} />
            </Paper>
          )}
        </Transition>
      </Container>
    </Center>
  );
}

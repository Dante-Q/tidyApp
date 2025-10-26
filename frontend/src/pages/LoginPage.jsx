import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  TextInput, PasswordInput, Paper, Title, Container,
  Button, Text, Group
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { UserContext } from '../context/UserContext.jsx';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      setError('');
      setLoading(true);

      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        values,
        { withCredentials: true }
      );

      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" sx={(theme) => ({ fontFamily: theme.fontFamily, fontWeight: 900 })}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Don't have an account yet?{' '}
        <Text component={Link} to="/register" size="sm" color="blue">Create account</Text>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {error && <Text color="red" size="sm" mb="sm">{error}</Text>}

          <TextInput label="Email" placeholder="you@example.com" required {...form.getInputProps('email')} />
          <PasswordInput label="Password" placeholder="Your password" required mt="md" {...form.getInputProps('password')} />

          <Group position="apart" mt="lg">
            <Text component={Link} to="/forgot-password" size="sm" color="blue">Forgot password?</Text>
          </Group>

          <Button fullWidth mt="xl" type="submit" loading={loading} disabled={!form.isValid()}>Sign in</Button>
        </form>
      </Paper>
    </Container>
  );
}

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  TextInput, PasswordInput, Paper, Title, Container,
  Button, Text
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { UserContext } from '../context/UserContext.jsx';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const form = useForm({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      setError('');
      setLoading(true);

      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        { name: values.name, email: values.email, password: values.password },
        { withCredentials: true } 
      );

      login(response.data.user);

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
        Create an account
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{' '}
        <Text component={Link} to="/login" size="sm" color="blue">Login</Text>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {error && <Text color="red" size="sm" mb="sm">{error}</Text>}

          <TextInput label="Name" placeholder="Your name" required {...form.getInputProps('name')} />
          <TextInput label="Email" placeholder="you@example.com" required mt="md" {...form.getInputProps('email')} />
          <PasswordInput label="Password" placeholder="Create a password" required mt="md" {...form.getInputProps('password')} />
          <PasswordInput label="Confirm Password" placeholder="Confirm your password" required mt="md" {...form.getInputProps('confirmPassword')} />

          <Button fullWidth mt="xl" type="submit" loading={loading} disabled={!form.isValid()}>Register</Button>
        </form>
      </Paper>
    </Container>
  );
}

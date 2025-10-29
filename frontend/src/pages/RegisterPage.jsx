import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserContext } from "../context/UserContext.jsx";
import { API_ENDPOINTS } from "../config/api.js";

export default function RegisterPage({ onRegister }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const form = useForm({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post(
        API_ENDPOINTS.auth.register,
        { name: values.name, email: values.email, password: values.password },
        { withCredentials: true }
      );

      login(response.data.user);

      // If onRegister callback provided (from drawer), call it; otherwise navigate
      if (onRegister) {
        onRegister(response.data.user);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" style={{ color: "#ffffff", fontWeight: 700 }}>
        Create an account
      </Title>

      <Paper
        withBorder
        shadow="xl"
        p={30}
        mt={30}
        radius="lg"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {error && (
            <Text color="red" size="sm" mb="sm">
              {error}
            </Text>
          )}

          <TextInput
            label="Name"
            placeholder="Your name"
            required
            size="md"
            styles={{
              label: { color: "#ffffff", fontWeight: 500, marginBottom: 8 },
              input: {
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                "&::placeholder": { color: "rgba(255, 255, 255, 0.4)" },
                "&:focus": {
                  border: "1px solid #6dd5ed",
                  background: "rgba(255, 255, 255, 0.15)",
                },
              },
            }}
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            size="md"
            styles={{
              label: { color: "#ffffff", fontWeight: 500, marginBottom: 8 },
              input: {
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                "&::placeholder": { color: "rgba(255, 255, 255, 0.4)" },
                "&:focus": {
                  border: "1px solid #6dd5ed",
                  background: "rgba(255, 255, 255, 0.15)",
                },
              },
            }}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Create a password"
            required
            mt="md"
            size="md"
            styles={{
              label: { color: "#ffffff", fontWeight: 500, marginBottom: 8 },
              input: {
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                "&::placeholder": { color: "rgba(255, 255, 255, 0.4)" },
                "&:focus": {
                  border: "1px solid #6dd5ed",
                  background: "rgba(255, 255, 255, 0.15)",
                },
              },
              innerInput: {
                color: "#ffffff",
              },
            }}
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            size="md"
            styles={{
              label: { color: "#ffffff", fontWeight: 500, marginBottom: 8 },
              input: {
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                "&::placeholder": { color: "rgba(255, 255, 255, 0.4)" },
                "&:focus": {
                  border: "1px solid #6dd5ed",
                  background: "rgba(255, 255, 255, 0.15)",
                },
              },
              innerInput: {
                color: "#ffffff",
              },
            }}
            {...form.getInputProps("confirmPassword")}
          />

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={loading}
            disabled={!form.isValid()}
            size="md"
            style={{
              background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
              fontWeight: 600,
              height: 48,
            }}
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

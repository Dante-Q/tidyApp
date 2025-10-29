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
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserContext } from "../context/UserContext.js";
import { API_ENDPOINTS } from "../config/api.js";

export default function LoginPage({ onLogin }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password should be at least 6 characters" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.post(API_ENDPOINTS.auth.login, values, {
        withCredentials: true,
      });

      login(response.data.user);

      // If onLogin callback provided (from drawer), call it; otherwise navigate
      if (onLogin) {
        onLogin(response.data.user);
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
        Welcome back!
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
            label="Email"
            placeholder="you@example.com"
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
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
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

          <Group position="apart" mt="lg">
            <Text
              component={Link}
              to="/forgot-password"
              size="sm"
              style={{ color: "#6dd5ed" }}
            >
              Forgot password?
            </Text>
          </Group>

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
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

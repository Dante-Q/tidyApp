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
import Alert from "../components/Alert.jsx";
import { UserContext } from "../context/UserContext.js";
import { API_ENDPOINTS } from "../config/api.js";

export default function LoginPage({ onLogin, onForgotPassword }) {
  const [error, setError] = useState("");
  const [requiresVerification, setRequiresVerification] = useState(false);
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
      setRequiresVerification(false);
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
      // Check if error is due to unverified email
      if (err.response?.data?.requiresVerification) {
        setRequiresVerification(true);
        setError(err.response.data.message);
      } else {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      }
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
          {requiresVerification && (
            <div style={{ marginBottom: "1rem" }}>
              <Alert
                type="warning"
                message={
                  <div>
                    <strong>Email Verification Required</strong>
                    <br />
                    {error}
                    <br />
                    <br />
                    <Text
                      size="sm"
                      style={{ color: "rgba(255, 255, 255, 0.8)" }}
                    >
                      Didn't receive the email?{" "}
                      <Link
                        to="/resend-verification"
                        style={{
                          color: "#6dd5ed",
                          textDecoration: "underline",
                        }}
                      >
                        Request a new verification link
                      </Link>
                    </Text>
                  </div>
                }
              />
            </div>
          )}

          {error && !requiresVerification && (
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
            {onForgotPassword ? (
              <Text
                component="button"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPassword();
                }}
                size="sm"
                style={{
                  color: "#6dd5ed",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </Text>
            ) : (
              <Text
                component={Link}
                to="/forgot-password"
                size="sm"
                style={{ color: "#6dd5ed" }}
              >
                Forgot password?
              </Text>
            )}
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

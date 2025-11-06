import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { API_ENDPOINTS } from "../config/api.js";

export default function ForgotPasswordPage({ onSuccess }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: { email: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values) => {
    try {
      setError("");
      setLoading(true);

      // TODO: Replace with actual API endpoint
      await axios.post(
        API_ENDPOINTS.auth.forgotPassword || "/api/auth/forgot-password",
        values,
        {
          withCredentials: true,
        }
      );

      setSuccess(true);

      // Navigate to OTP verification page after 2 seconds
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        navigate("/verify-otp", { state: { email: values.email } });
      }, 2000);
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
        Forgot Password?
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
        {success ? (
          <div style={{ textAlign: "center" }}>
            <Text
              style={{
                color: "#6dd5ed",
                fontSize: "1.2rem",
                marginBottom: "1rem",
              }}
            >
              ✓ Code sent successfully!
            </Text>
            <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
              Check your email for a 6-digit verification code. Redirecting to
              verification page...
            </Text>
          </div>
        ) : (
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
              Send Verification Code
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
}

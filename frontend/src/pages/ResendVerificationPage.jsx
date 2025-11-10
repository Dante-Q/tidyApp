import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
} from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import axios from "axios";
import Alert from "../components/Alert.jsx";
import { API_ENDPOINTS } from "../config/api.js";

function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post(API_ENDPOINTS.auth.resendVerification, {
        email,
      });

      setSuccess(true);
      setEmail("");
    } catch (err) {
      if (err.response?.data?.alreadyVerified) {
        setError("This email is already verified. You can log in.");
      } else {
        setError(
          err.response?.data?.message || "Failed to send verification email"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ marginTop: "100px" }}>
      <Paper
        shadow="xl"
        p="xl"
        radius="lg"
        withBorder
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Stack gap="lg">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <IconMail size={40} color="white" />
            </div>
            <Title order={2} style={{ color: "#ffffff" }}>
              Resend Verification Email
            </Title>
            <Text
              size="sm"
              mt="xs"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Enter your email address and we'll send you a new verification
              link
            </Text>
          </div>

          {success && (
            <Alert
              type="success"
              message="Verification email sent! Please check your inbox and spam folder."
            />
          )}

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Email Address"
                placeholder="your@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftSection={<IconMail size={16} />}
                styles={{
                  label: {
                    color: "#ffffff",
                    fontWeight: 500,
                    marginBottom: 8,
                  },
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
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                size="md"
                style={{
                  background:
                    "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
                  fontWeight: 600,
                  height: 48,
                }}
              >
                Send Verification Email
              </Button>

              <Text
                size="sm"
                ta="center"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Already verified?{" "}
                <Link
                  to="/login"
                  style={{ color: "#6dd5ed", textDecoration: "none" }}
                >
                  Log in
                </Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ResendVerificationPage;

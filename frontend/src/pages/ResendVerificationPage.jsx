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
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <IconMail size={40} color="white" />
            </div>
            <Title order={2}>Resend Verification Email</Title>
            <Text c="dimmed" size="sm" mt="xs">
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
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                Send Verification Email
              </Button>

              <Text size="sm" ta="center">
                Already verified?{" "}
                <Link
                  to="/login"
                  style={{ color: "#667eea", textDecoration: "none" }}
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

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Loader,
  Group,
  Stack,
} from "@mantine/core";
import { IconCheck, IconX, IconMail } from "@tabler/icons-react";
import axios from "axios";
import Alert from "../components/Alert.jsx";
import { API_ENDPOINTS } from "../config/api.js";

function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error, expired
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.auth.verify(token));

        setStatus("success");
        setMessage(response.data.message);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        if (error.response?.data?.expired) {
          setStatus("expired");
          setMessage(error.response.data.message);
        } else if (error.response?.data?.alreadyVerified) {
          setStatus("success");
          setMessage(error.response.data.message);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(error.response?.data?.message || "Verification failed");
        }
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Container size="xs" style={{ marginTop: "100px" }}>
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack align="center" gap="lg">
          {status === "verifying" && (
            <>
              <Loader size="xl" />
              <Title order={2}>Verifying your email...</Title>
              <Text c="dimmed" ta="center">
                Please wait while we verify your email address
              </Text>
            </>
          )}

          {status === "success" && (
            <>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={48} color="white" />
              </div>
              <Title order={2}>Email Verified!</Title>
              <Alert
                type="success"
                message={
                  message || "Your email has been successfully verified!"
                }
              />
              <Text size="sm" c="dimmed">
                Redirecting to login page...
              </Text>
              <Button
                component={Link}
                to="/login"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                fullWidth
              >
                Go to Login
              </Button>
            </>
          )}

          {status === "expired" && (
            <>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#ffa94d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconMail size={48} color="white" />
              </div>
              <Title order={2}>Link Expired</Title>
              <Alert
                type="warning"
                message={
                  message ||
                  "Your verification link has expired. Please request a new one."
                }
              />
              <Group grow style={{ width: "100%" }}>
                <Button
                  component={Link}
                  to="/resend-verification"
                  variant="gradient"
                  gradient={{ from: "orange", to: "yellow" }}
                >
                  Request New Link
                </Button>
                <Button component={Link} to="/login" variant="light">
                  Go to Login
                </Button>
              </Group>
            </>
          )}

          {status === "error" && (
            <>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#fa5252",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconX size={48} color="white" />
              </div>
              <Title order={2}>Verification Failed</Title>
              <Alert
                type="error"
                message={message || "An error occurred during verification."}
              />
              <Group grow style={{ width: "100%" }}>
                <Button
                  component={Link}
                  to="/resend-verification"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  Resend Email
                </Button>
                <Button component={Link} to="/login" variant="light">
                  Go to Login
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

export default VerifyEmailPage;

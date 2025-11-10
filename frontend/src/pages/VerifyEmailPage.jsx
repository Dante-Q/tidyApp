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
        <Stack align="center" gap="lg">
          {status === "verifying" && (
            <>
              <Loader size="xl" color="cyan" />
              <Title order={2} style={{ color: "#ffffff" }}>
                Verifying your email...
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)" }} ta="center">
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
                    "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconCheck size={48} color="white" />
              </div>
              <Title order={2} style={{ color: "#ffffff" }}>
                Email Verified!
              </Title>
              <Alert
                type="success"
                message={
                  message || "Your email has been successfully verified!"
                }
              />
              <Text size="sm" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Redirecting to login page...
              </Text>
              <Button
                component={Link}
                to="/login"
                fullWidth
                size="md"
                style={{
                  background:
                    "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
                  fontWeight: 600,
                  height: 48,
                }}
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
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconMail size={48} color="white" />
              </div>
              <Title order={2} style={{ color: "#ffffff" }}>
                Link Expired
              </Title>
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
                  size="md"
                  style={{
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    fontWeight: 600,
                  }}
                >
                  Request New Link
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  size="md"
                  variant="outline"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "#ffffff",
                  }}
                >
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
                  background:
                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconX size={48} color="white" />
              </div>
              <Title order={2} style={{ color: "#ffffff" }}>
                Verification Failed
              </Title>
              <Alert
                type="error"
                message={message || "An error occurred during verification."}
              />
              <Group grow style={{ width: "100%" }}>
                <Button
                  component={Link}
                  to="/resend-verification"
                  size="md"
                  style={{
                    background:
                      "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
                    fontWeight: 600,
                  }}
                >
                  Resend Email
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  size="md"
                  variant="outline"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "#ffffff",
                  }}
                >
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

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Paper, Title, Container, Button, Text } from "@mantine/core";
import { API_ENDPOINTS } from "../config/api.js";
import "./VerifyOTPPage.css";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);
        // Focus last filled input or last input
        const focusIndex = Math.min(digits.length, 5);
        inputRefs.current[focusIndex]?.focus();
      });
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // TODO: Replace with actual API endpoint
      await axios.post(
        API_ENDPOINTS.auth.verifyOTP || "/api/auth/verify-otp",
        { email, code },
        { withCredentials: true }
      );

      // Navigate to reset password page or dashboard
      navigate("/reset-password", { state: { email, code } });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid code. Please try again."
      );
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError("");
      setLoading(true);

      // TODO: Replace with actual API endpoint
      await axios.post(
        API_ENDPOINTS.auth.forgotPassword || "/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setError("");
      // Show success message briefly
      const successMsg = "New code sent!";
      setError(successMsg);
      setTimeout(() => setError(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to resend code"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          background: "linear-gradient(135deg, #0a0f1e 0%, #1a2332 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <Container size={420} my={40}>
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
            <Text align="center" style={{ color: "#ffffff" }}>
              Please start from the forgot password page.
            </Text>
            <Button
              fullWidth
              mt="md"
              component={Link}
              to="/forgot-password"
              style={{
                background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
              }}
            >
              Go to Forgot Password
            </Button>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: "linear-gradient(135deg, #0a0f1e 0%, #1a2332 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <Container size={420} my={40}>
        <Title align="center" style={{ color: "#ffffff", fontWeight: 700 }}>
          Enter Verification Code
        </Title>

        <Text
          align="center"
          size="sm"
          mt="sm"
          style={{ color: "rgba(255, 255, 255, 0.7)" }}
        >
          We sent a 6-digit code to{" "}
          <strong style={{ color: "#6dd5ed" }}>{email}</strong>
        </Text>

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
          <form onSubmit={handleSubmit}>
            {error && (
              <Text
                color={error === "New code sent!" ? "#6dd5ed" : "red"}
                size="sm"
                mb="md"
                align="center"
              >
                {error}
              </Text>
            )}

            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <Button
              fullWidth
              mt="xl"
              type="submit"
              loading={loading}
              disabled={otp.join("").length !== 6}
              size="md"
              style={{
                background: "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
                fontWeight: 600,
              }}
            >
              Verify Code
            </Button>

            <Text
              align="center"
              mt="md"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Didn't receive the code?{" "}
              <Text
                component="button"
                type="button"
                onClick={handleResend}
                disabled={loading}
                style={{
                  color: "#6dd5ed",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Resend
              </Text>
            </Text>

            <Text
              align="center"
              mt="sm"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              <Text
                component={Link}
                to="/login"
                style={{ color: "#6dd5ed", fontWeight: 500 }}
              >
                Back to login
              </Text>
            </Text>
          </form>
        </Paper>
      </Container>
    </div>
  );
}

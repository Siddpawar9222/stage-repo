import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { requestForgetPassword } from "../services/apis/user/authUser";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../app/reducers/modalSlice";
import { MODAL_CONSTANTS } from "../utils/modalUtils";
import { RootState } from "../app/store";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [emailId, setEmailId] = useState<string>("");
  const [emailError, setEmailError] = useState<string>(""); // ❗️Client-side error
  const [serverErrorMessage, setServerErrorMessage] = useState<string>(""); // ❗️Server-side error
  const [resetRequestSent, setResetRequestSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user) //new

  const validateEmail = (email: string): string => {
    if (!email.trim()) return "Email address is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const updateEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailId(value);
    setEmailError(validateEmail(value)); // live validation
    setServerErrorMessage(""); // clear server errors when user types
  };

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateEmail(emailId);
    setEmailError(validationError);
    setServerErrorMessage("");

    if (validationError) return;

    setLoading(true);

    try {
      const response = await requestForgetPassword(emailId);

      if (response.status === 201) {
        setResetRequestSent(true);
      } else if (response.status === 400) {
        // Custom server-side error
        const msg =
          response?.data?.message || response.statusText || "Invalid request";
        setServerErrorMessage(msg);
      } else {
        // Unexpected error (e.g., 500)
        dispatch(
          openModal({
            title: response.statusText || "Server Error",
            bodyType: MODAL_CONSTANTS.ERROR,
          })
        );
      }
    } catch (err: any) {
      setServerErrorMessage(
        err?.message || "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Forgot Password
          </Typography>

          {resetRequestSent ? (
            <>
              <Box textAlign="center" mt={4}>
                <CheckCircleIcon
                  color="success"
                  sx={{ fontSize: 80, marginBottom: 2 }}
                />
              </Box>
              <Typography variant="h5" align="center" fontWeight="bold">
                Link Sent
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{ mt: 2, mb: 4, fontWeight: "500" }}
              >
                Check your email to reset your password
              </Typography>
              <Box textAlign="center">
                <Link to="/auth/login" style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="primary" fullWidth>
                    Return to Login
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                align="center"
                sx={{ mt: 2, mb: 4, fontWeight: "500" }}
              >
                We will send a password reset link to your email address
              </Typography>

              {serverErrorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {serverErrorMessage}
                </Alert>
              )}

              <form onSubmit={submitForm}>
                <TextField
                  label="Email Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={emailId}
                  onChange={updateEmail}
                  required
                  type="email"
                  error={!!emailError}
                  helperText={emailError}
                  inputProps={{ "data-testid": "email-input" }}
                />

                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                    data-testid="submit-button"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Box>
              </form>

              {/* <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account yet?{" "}
                <Link to="/auth/register" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ textDecoration: "none", cursor: "pointer" }}
                  >
                    Register
                  </Typography>
                </Link>
              </Typography> */}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;

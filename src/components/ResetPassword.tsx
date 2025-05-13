import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import { isTokenValid, resetPassword } from "../services/apis/user/authUser";
import { MODAL_CONSTANTS } from "../utils/modalUtils";
import { useDispatch } from "react-redux";
import { openModal } from "../app/reducers/modalSlice";

interface FormValues {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password: string;
  confirmPassword: string;
  form?: string;
}

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState<FormValues>({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const checkTokenValidation = async (token: string | null) => {
    const response = await isTokenValid(token);
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");
  
    if (resetToken) {
      const validate = async () => {
        const isTrue = await checkTokenValidation(resetToken);
        if (isTrue) {
          setToken(resetToken);
        } else {
          setToken(null);
        }
      };
      validate();

    } else {
      setToken(null); 
    }
  }, [location.search]);
  

  // Utility to validate password strength
  const validatePassword = (password: string): string => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters with at least one number, one lowercase and one uppercase letter.";
    }
    return "";
  };



  const validateForm = (): boolean => {
    const { password, confirmPassword } = formValues;
    const passwordError = validatePassword(password);
    const confirmPasswordError =
      password !== confirmPassword ? "Passwords do not match." : "";

    const errors: FormErrors = {
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    setFormErrors(errors);

    return !passwordError && !confirmPasswordError;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === "password") {
      const error = validatePassword(value);
      setFormErrors((prev) => ({
        ...prev,
        password: error,
      }));

      if (formValues.confirmPassword) {
        setFormErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== formValues.confirmPassword ? "Passwords do not match." : "",
        }));
      }
    }

    if (name === "confirmPassword") {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formValues.password ? "Passwords do not match." : "",
      }));
    }
  };

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({ password: "", confirmPassword: "", form: "" });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await resetPassword({
        token,
        newPassword: formValues.password,
      });

      if (response.status === 201) {
        setResetSuccess(true);
      } else if (response.status === 400) {
        const serverErrors = response.statusText || {};
        setFormErrors((prev) => ({
          ...prev,
          ...serverErrors,
          form: response.statusText || "Validation failed",
        }));
      } else {
        dispatch(
          openModal({
            title: response?.statusText || "Error",
            bodyType: MODAL_CONSTANTS.ERROR,
          })
        );
      }
    } catch (err: any) {
      setFormErrors((prev) => ({
        ...prev,
        form: err.message || "Something went wrong. Try again later.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
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
            Reset Password
          </Typography>

          {!token && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Invalid or missing reset token. Please request a new password reset link.
            </Alert>
          )}

          {resetSuccess ? (
            <>
              <Alert severity="success" sx={{ mt: 3, mb: 3 }}>
                Your password has been successfully reset!
              </Alert>
              <Box textAlign="center">
                <Link to="/auth/login" style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="primary" fullWidth>
                    Login Now
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
                Enter your new password below
              </Typography>

              {formErrors.form && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formErrors.form}
                </Alert>
              )}

              <form onSubmit={submitForm}>
                <TextField
                  label="New Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  name="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                  required
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={!token}
                />

                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="password"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleInputChange}
                  required
                  error={!!formErrors.confirmPassword}
                  helperText={formErrors.confirmPassword}
                  disabled={!token}
                />

                <Box sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading || !token}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Box>
              </form>

              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Remember your password?{" "}
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ textDecoration: "none", cursor: "pointer" }}
                  >
                    Login
                  </Typography>
                </Link>
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;

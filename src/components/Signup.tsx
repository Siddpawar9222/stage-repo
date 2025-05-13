import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signupUser } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { AppDispatch } from "../app/store";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setSuccessMessage("");

    dispatch(signupUser(name, email, password))
      .then((response: any) => {
        if (response?.message) {
          setSuccessMessage(response.message);
          setTimeout(() => navigate("/"), 2000); // Redirect to login after 2 sec
        } else {
          setErrorMessage("Signup failed. Please try again.");
        }
      })
      .catch((error) => {
        setErrorMessage(error.message || "An error occurred during signup.");
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Signup
        </Typography>
        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
        )}
        <form onSubmit={handleSignup}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button variant="text" onClick={() => navigate("/")}>
            Login
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;

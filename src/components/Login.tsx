import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { loginUser } from "../features/auth/authApi"
import { Link, useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  ThemeProvider,
} from "@mui/material"
import GoogleIcon from '@mui/icons-material/Google';
import { AppDispatch } from "../app/store"
import { useRole } from "../RoleContext"
import { lightTheme } from "../utils/theme"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { setUserRole } = useRole()
  const [loaderForOauth2, setLoaderForOauth2] = useState(false);

  const BASEURL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    dispatch(loginUser(email, password))
      .then((response: any) => {
        if (response?.data?.jwtToken) {
          const roles = JSON.parse(localStorage.getItem("roles") || "[]")
          if (roles && roles.length > 0) {
            setUserRole(roles[0])
          }
          navigate("/dashboard")
        } else {
          setErrorMessage("Login failed. Please check your credentials.")
        }
      })
      .catch(error => {
        setErrorMessage(error.message || "An error occurred during login.")
      })
  }

  const handleOauth2Login = () => {
    setLoaderForOauth2(true);
    window.location.href = `${BASEURL}/oauth2/authorization/google?frontend=tenant-manage`;
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                <Typography
                  component="span"
                  color="primary"
                  sx={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Forgot Password?
                </Typography>
              </Link>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
          <br />
          {/* <Button
            fullWidth
            variant="outlined"
            onClick={handleOauth2Login}
            sx={{ mb: 2, height: 48 }}
          >
            <GoogleIcon sx={{ fontSize: "20", paddingRight: "10px" }} />
            {loaderForOauth2 ? "Loading..." : "Sign in with Google"}
          </Button> */}

          {/* <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Button variant="text" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </Typography> */}
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default Login

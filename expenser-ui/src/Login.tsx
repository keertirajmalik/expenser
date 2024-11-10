import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  FormGroup,
  TextField,
  Button,
} from "@mui/material";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already authenticated
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      navigate("/dashboard"); // Redirect to the dashboard or any other page
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/cxf/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then(() => {
      localStorage.setItem("isAuthenticated", "true");
      onLogin();
      navigate("/"); // Redirect to the dashboard or any other page
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          position: "relative",
          padding: 4,
          width: 400,
          maxWidth: "90%",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          component="h1"
          fontWeight={700}
          color="#1c2543"
          gutterBottom
        >
          Expenser
        </Typography>
        <FormGroup>
          <TextField
            required
            label="Username"
            size="small"
            margin="normal"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            required
            type="password"
            label="Password"
            size="small"
            margin="normal"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            fullWidth
            onClick={handleSubmit}
          >
            Login
          </Button>
        </FormGroup>
      </Paper>
    </Box>
  );
};

export default Login;

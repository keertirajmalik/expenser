import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

interface LoginProps {
  onLogin: () => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      navigate("/");
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
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const expireAt = new Date(Date.now() + 1000 * 60).toISOString();
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("expireAt", expireAt);
        localStorage.setItem("token", data.token);
        onLogin();
        navigate("/"); // Redirect to the dashboard or any other page
      })
      .catch(() => {
        return;
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
        <form onSubmit={handleSubmit}>
          <TextField
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
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Don&apos;t have an account? <Link to="/auth/signup">Sign Up</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;

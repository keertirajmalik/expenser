import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "../providers/AuthContext";
import { useUser } from "../providers/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setName: setContextName } = useUser();
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
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
          return;
        }
        return response.json();
      })
      .then((data) => {
        handleLogin(data.token, data.name);
        setContextName(data.name);
        navigate("/");
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

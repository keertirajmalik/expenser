import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "../providers/AuthContext";
import { useUser } from "../providers/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setName: setContextName } = useUser();
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    fetch("/cxf/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }
        return response.json();
      })
      .then((data) => {
        handleLogin(data.token, data.name);
        setContextName(data.name);
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
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
          {error && (
            <Typography variant="body2" color="error" align="center">
              {error}
            </Typography>
          )}
          <TextField
            required
            label="Username"
            size="small"
            margin="normal"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            aria-label="Username"
            error={!!error}
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
            aria-label="Password"
            error={!!error}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
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

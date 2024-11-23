import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    fullname: "",
    submit: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors((prev) => ({
        ...prev,
        password: passwordError,
      }));
      return;
    }
    fetch("/cxf/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: fullname, username, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
        return response.json();
      })
      .then(() => {
        navigate("/auth/login");
      })
      .catch((error) => {
        setErrors((prev) => ({
          ...prev,
          submit: error.message,
        }));
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
        <form onSubmit={handleSubmit} noValidate aria-label="Sign up form">
          {errors.submit && (
            <Typography color="error" align="center">
              {errors.submit}
            </Typography>
          )}
          <TextField
            required
            label="Full Name"
            name="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            error={!!errors.fullname}
            helperText={errors.fullname}
            aria-label="Full Name input"
          />
          <TextField
            required
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            error={!!errors.username}
            helperText={errors.username}
            aria-label="Username input"
          />
          <TextField
            required
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            error={!!errors.password}
            helperText={errors.password}
            aria-label="Password input"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Already have an account? <Link to="/auth/login">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;

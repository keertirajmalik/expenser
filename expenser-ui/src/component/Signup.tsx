import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/cxf/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: fullname, username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        navigate("/auth/login");
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
        <form onSubmit={handleSubmit}>
          <TextField
            required
            label="Full Name"
            name="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            fullWidth
          >
            Sign Up
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

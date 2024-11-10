import { Box, CircularProgress, CssBaseline } from "@mui/material";
import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import NavigationBar from "./NavigationBar.tsx";
import TransactionTable from "./TransactionTable.tsx";
import { TransactionsProvider } from "./providers/TransactionsContext.tsx";
import Login from "./Login.tsx";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already authenticated
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <StrictMode>
      <CssBaseline />
      {isLoggedIn ? (
        <TransactionsProvider>
          <NavigationBar />
          <TransactionTable />
        </TransactionsProvider>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>,
);
// TODO: create sidebar with navigation links to transactions and types pages

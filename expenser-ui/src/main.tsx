import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import TransactionTable from "./TransactionTable";
import { TransactionsProvider } from "./providers/TransactionsContext";
import NavigationBar from "./NavigationBar";
import Login from "./Login";
import SignUp from "./Signup";
import { useAuth, AuthProvider } from "./providers/AuthContext";

const App = () => {
  const { isLoggedIn, loading, handleLogin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
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

const LoadingSpinner = () => (
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

const Main = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/auth/login"
          element={<Login onLogin={useAuth().handleLogin} />}
        />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <Main />
  </AuthProvider>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import { TransactionsProvider } from "./providers/TransactionsContext";
import { useAuth, AuthProvider } from "./providers/AuthContext";
import { UserProvider } from "./providers/UserContext";
import Appbar from "./component/Appbar/AppBar";
import SignUp from "./component/Signup";
import TransactionTable from "./component/TransactionTable";
import Login from "./component/Login";

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <StrictMode>
      <CssBaseline />
      <TransactionsProvider>
        <Appbar />
        <TransactionTable />
      </TransactionsProvider>
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
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
